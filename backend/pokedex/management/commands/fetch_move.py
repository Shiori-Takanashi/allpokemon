# fetch_move.py

from __future__ import annotations

from typing import Optional

import aiohttp
import asyncio
from django.core.management.base import CommandError
from tqdm import tqdm

from .fetch_base_command import FetcherBaseCommand

# Move グループに属するエンドポイントをまとめる
MOVE_ENDPOINTS = {
    "move": "https://pokeapi.co/api/v2/move?limit=100000&offset=0",
    "move-ailment": "https://pokeapi.co/api/v2/move-ailment?limit=100000&offset=0",
    "move-battle-style": "https://pokeapi.co/api/v2/move-battle-style?limit=100000&offset=0",
    "move-categories": "https://pokeapi.co/api/v2/move-category?limit=100000&offset=0",
    "move-damage-class": "https://pokeapi.co/api/v2/move-damage-class?limit=100000&offset=0",
    "move-learn-method": "https://pokeapi.co/api/v2/move-learn-method?limit=100000&offset=0",
}


class Command(FetcherBaseCommand):
    """
    moveグループに属するエンドポイントをフェッチするコマンド。

    Usage:
      python manage.py fetch_move all
      python manage.py fetch_move move-ailment
      ...
    """
    help: str = (
        "Fetch JSON data for 'move' group from PokeAPI. "
        "Specify a sub-endpoint or 'all'."
    )
    group_name: str = "move"

    def add_arguments(self, parser) -> None:
        """
        コマンドライン引数: [all|サブエンドポイント名]
        """
        parser.add_argument(
            "sub_name",
            nargs="?",
            default="all",
            help="Endpoint category (move, move-ailment, etc.) or 'all'.",
        )

    async def handle_async(self, *args, **options) -> None:
        """
        非同期エントリーポイント:
        1) sub_name == "all" -> MOVE_ENDPOINTS 全部
        2) 特定のサブエンドポイントのみ
        """
        sub_name: str = options.get("sub_name", "all")
        if sub_name == "all":
            tasks = [self.fetch_endpoint(name_) for name_ in MOVE_ENDPOINTS]
            await asyncio.gather(*tasks)
        else:
            if sub_name not in MOVE_ENDPOINTS:
                raise CommandError(f"不正なカテゴリ: {sub_name}")
            await self.fetch_endpoint(sub_name)

    async def fetch_endpoint(self, sub_name: str) -> None:
        """
        個別のエンドポイント (move, move-ailmentなど) を取得してファイル保存。
        """
        list_endpoint = MOVE_ENDPOINTS[sub_name]
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

                # tqdm で進捗表示（ポケモン技のフェッチは大変なので、進捗バー必須！）
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
