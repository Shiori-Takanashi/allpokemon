# fetch_pokemon.py

from __future__ import annotations

from typing import Optional

import aiohttp
import asyncio
from django.core.management.base import CommandError
from tqdm import tqdm

from .fetch_base_command import FetcherBaseCommand

# Pokemon グループに属するエンドポイントをまとめる
POKEMON_ENDPOINTS = {
    "pokemon-pokemon": "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0",
    "pokemon-form": "https://pokeapi.co/api/v2/pokemon-form?limit=100000&offset=0",
    "pokemon-species": "https://pokeapi.co/api/v2/pokemon-species?limit=100000&offset=0",
    "pokemon-abilities": "https://pokeapi.co/api/v2/ability?limit=100000&offset=0",
    "pokemon-characteristics": "https://pokeapi.co/api/v2/characteristic?limit=100000&offset=0",
    "pokemon-egg-group": "https://pokeapi.co/api/v2/egg-group?limit=100000&offset=0",
    "pokemon-gender": "https://pokeapi.co/api/v2/gender?limit=100000&offset=0",
    "pokemon-grows": "https://pokeapi.co/api/v2/growth-rate?limit=100000&offset=0",
    "pokemon-nature": "https://pokeapi.co/api/v2/nature?limit=100000&offset=0",
    "pokemon-habitat": "https://pokeapi.co/api/v2/pokemon-habitat?limit=100000&offset=0",
    "pokemon-stat": "https://pokeapi.co/api/v2/stat?limit=100000&offset=0",
    "pokemon-type": "https://pokeapi.co/api/v2/type?limit=100000&offset=0",
}


class Command(FetcherBaseCommand):
    """
    pokemonグループに属するエンドポイントをフェッチするコマンド。

    Usage:
      python manage.py fetch_pokemon all
      python manage.py fetch_pokemon pokemon-ailment
      ...
    """
    help: str = (
        "Fetch JSON data for 'pokemon' group from PokeAPI. "
        "Specify a sub-endpoint or 'all'."
    )
    group_name: str = "pokemon"

    def add_arguments(self, parser) -> None:
        """
        コマンドライン引数: [all|サブエンドポイント名]
        """
        parser.add_argument(
            "sub_name",
            nargs="?",
            default="all",
            help="Endpoint category (pokemon-pokemon,pokemon-form,pokemon-species...) or 'all'.",
        )

    async def handle_async(self, *args, **options) -> None:
        """
        非同期エントリーポイント:
        1) sub_name == "all" -> POKEMON_ENDPOINTS 全部
        2) 特定のサブエンドポイントのみ
        """
        sub_name: str = options.get("sub_name", "all")
        if sub_name == "all":
            tasks = [self.fetch_endpoint(name_) for name_ in POKEMON_ENDPOINTS]
            await asyncio.gather(*tasks)
        else:
            if sub_name not in POKEMON_ENDPOINTS:
                raise CommandError(f"不正なカテゴリ: {sub_name}")
            await self.fetch_endpoint(sub_name)

    async def fetch_endpoint(self, sub_name: str) -> None:
        """
        個別のエンドポイント (pokemon, pokemon-formなど) を取得してファイル保存。
        """
        list_endpoint = POKEMON_ENDPOINTS[sub_name]
        current_stage = self.get_current_stage(self.group_name, sub_name)

        # リセット判定
        if current_stage > self.max_stage:
            self.reset_stages(self.group_name, sub_name)
            current_stage = 1

        logger = self.setup_logger(self.group_name, sub_name, current_stage)

        json_dir = self.get_json_dir(self.group_name, sub_name)
        json_dir.mkdir(parents=True, exist_ok=True)

        logger.info(
            "フェッチ開始: sub_name=%s, stage=%d, endpoint=%s",
            sub_name,
            current_stage,
            list_endpoint,
        )

        # 標準出力にまとめて出すためのバッファ
        stdout_messages = []

        try:
            async with aiohttp.ClientSession() as session:
                # まず一覧を取得
                async with session.get(list_endpoint) as resp:
                    logger.debug(f"GET {list_endpoint} - status={resp.status}")
                    resp.raise_for_status()
                    data = await resp.json()

                items = data.get("results", [])
                total_items = len(items)
                logger.info("対象アイテム数: %d 件", total_items)
                logger.debug(f"items preview: {items[:3]} (・・・)")  # 先頭3件だけデバッグログに表示

                # フェッチタスクの作成
                tasks = [
                    self.fetch_and_save(session, item, json_dir, logger)
                    for item in items
                ]

                # tqdm で進捗表示（ポケモンのフェッチは大変なので、進捗バー必須！）
                for task in tqdm(
                    asyncio.as_completed(tasks),
                    total=total_items,
                    desc=f"{sub_name} をフェッチ中",
                    unit="アイテム"
                ):
                    try:
                        result_msg: Optional[str] = await task
                        if result_msg:
                            # 返却されたメッセージは成功・失敗を問わず stdout バッファへ
                            stdout_messages.append(result_msg)
                    except Exception as e:
                        # 予期しないエラーをキャッチ
                        error_msg = f"予期しないエラー: {e}"
                        logger.error(error_msg)
                        # ここでも stdout バッファへ追加
                        stdout_messages.append(error_msg)

        except aiohttp.ClientError as e:
            logger.error(f"{list_endpoint} の取得に失敗しました: {e}")
            self.stderr.write("リストの取得に失敗しました。ログを確認してください。")
            return

        # tqdm終了後にバッファしていたメッセージを一括出力
        if stdout_messages:
            self.stdout.write("\n".join(stdout_messages))

        logger.info(
            "フェッチ完了: sub_name=%s (stage=%d), dir=%s",
            sub_name,
            current_stage,
            json_dir,
        )
        self.stdout.write(f"{sub_name} (stage={current_stage}) => {json_dir}")

        self.update_stage(self.group_name, sub_name, current_stage)
