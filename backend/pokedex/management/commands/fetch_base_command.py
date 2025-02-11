# fetch_base_command.py

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional

import aiofiles
import aiohttp
from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone


class TZFormatter(logging.Formatter):
    """
    Djangoのタイムゾーン設定に基づいてログのタイムスタンプをフォーマットするカスタムフォーマッタ。
    """

    def formatTime(self, record: logging.LogRecord, datefmt: str | None = None) -> str:
        """
        ログレコードの時刻を Django のタイムゾーン設定に基づきフォーマットする。
        """
        current_time = timezone.localtime(timezone.now())
        if datefmt:
            return current_time.strftime(datefmt)
        return current_time.isoformat()


class FetcherBaseCommand(BaseCommand):
    """
    PokeAPIなどからデータを非同期でフェッチし、
    JSONおよびログを適切な階層構造で出力するためのベースクラス。

    【特徴】
    - Python の asyncio を活用した非同期 HTTP リクエスト (via aiohttp)
    - pathlib.Path を使用したパス操作
    - Djangoのタイムゾーンを取り入れたログフォーマット (TZFormatter)
    - ステージ管理 (01xxx.log, 02xxx.log, ... と stage_tracker.log)
    """

    max_stage: int = 99  # ステージ番号の最大値

    async def fetch_and_save(
        self,
        session: aiohttp.ClientSession,
        item: Dict[str, Any],
        json_dir: Path,
        logger: logging.Logger
    ) -> Optional[str]:
        """
        個別のリソースをフェッチし、JSON に保存する。
        成功時は「特定条件(IDが100の倍数)でのメッセージ文字列」、
        それ以外は None、失敗時はエラーメッセージ文字列を返す。

        :param session: aiohttp.ClientSession
        :param item: { "name": str, "url": str } を想定
        :param json_dir: JSONファイルの保存先ディレクトリ
        :param logger: ロガー
        :return: メッセージ文字列 or None
        """
        name: str = item.get("name", "unknown")
        url: str = item.get("url", "")
        if not url:
            msg = f"URL がありません: {item}"
            logger.error(msg)
            return msg

        # 開始時点のデバッグログ
        logger.debug(f"[fetch_and_save] Fetching item='{name}', url='{url}'")

        # URL からデータをフェッチ
        try:
            async with session.get(url) as response:
                # レスポンスステータス等をdebugログに残す
                logger.debug(
                    f"[fetch_and_save] GET {url} - status={response.status}"
                )
                response.raise_for_status()
                data = await response.json()
        except aiohttp.ClientError as exc:
            msg = f"取得失敗: {name} ({url}): {exc}"
            logger.error(msg)
            return msg

        # ID抽出
        id_num = self.extract_id_from_url(url)
        if id_num is None:
            msg = f"{name} の ID を URL={url} から抽出できません。"
            logger.error(msg)
            return msg

        file_path = json_dir / f"{id_num:05d}.json"

        # JSONファイル書き込み
        try:
            async with aiofiles.open(file_path, "w", encoding="utf-8") as afp:
                await afp.write(json.dumps(data, ensure_ascii=False, indent=4))
        except OSError as exc:
            msg = f"{file_path} に書き込めませんでした: {exc}"
            logger.error(msg)
            return msg

        # 成功したアイテムも debug ログに残す
        logger.debug(f"[fetch_and_save] Successfully wrote to {file_path}")

        return None

    def extract_id_from_url(self, url: str) -> Optional[int]:
        """
        URL末尾の数字を ID として取り出す。失敗時は None を返す。
        例: https://pokeapi.co/api/v2/???/13/ -> 13
        """
        url = url.rstrip("/")
        if "/" not in url:
            return None
        parts = url.split("/")
        try:
            return int(parts[-1])
        except ValueError:
            return None

    def get_json_dir(self, group_name: str, sub_name: str) -> Path:
        """
        JSONファイルの保存先ディレクトリを返す。
        例: BASE_DIR/data/raw/{group_name}/{sub_name}
        """
        return Path(settings.BASE_DIR) / "data" / "raw" / group_name / sub_name

    def get_log_dir(self, group_name: str, sub_name: str) -> Path:
        """
        ログファイルの保存先ディレクトリを返す。
        例: BASE_DIR/log/raw/{group_name}/{sub_name}
        """
        return Path(settings.BASE_DIR) / "log" / "raw" / group_name / sub_name

    def get_current_stage(self, group_name: str, sub_name: str) -> int:
        """
        stage_tracker.log を読み、現在のステージ番号を返す。存在しなければ 1。
        """
        log_dir = self.get_log_dir(group_name, sub_name)
        tracker_path = log_dir / "stage_tracker.log"
        if not tracker_path.exists():
            return 1

        try:
            with tracker_path.open("r", encoding="utf-8") as f:
                lines = f.readlines()
                if not lines:
                    return 1
                last_line = lines[-1].strip()  # 例: "Stage updated to 5"
                *_, num_str = last_line.split()
                return int(num_str)
        except (IndexError, ValueError):
            return 1

    def update_stage(self, group_name: str, sub_name: str, current_stage: int) -> None:
        """
        ステージを (current_stage + 1) にして、stage_tracker.log に追記する。
        max_stage を超えたら 1 に戻る。
        """
        new_stage = current_stage + 1
        if new_stage > self.max_stage:
            new_stage = 1

        log_dir = self.get_log_dir(group_name, sub_name)
        log_dir.mkdir(parents=True, exist_ok=True)
        tracker_path = log_dir / "stage_tracker.log"
        with tracker_path.open("a", encoding="utf-8") as f:
            f.write(f"Stage updated to {new_stage}\n")

    def reset_stages(self, group_name: str, sub_name: str) -> None:
        """
        01{sub_name}.log ~ 99{sub_name}.log および stage_tracker.log を削除し、ステージをリセット。
        """
        log_dir = self.get_log_dir(group_name, sub_name)
        if not log_dir.exists():
            return

        # stage_tracker.log の削除
        tracker_path = log_dir / "stage_tracker.log"
        if tracker_path.exists():
            tracker_path.unlink()

        # 01{sub_name}.log ~ 99{sub_name}.log を削除
        for stage_num in range(1, self.max_stage + 1):
            log_filename = f"{stage_num:02d}{sub_name}.log"
            file_path = log_dir / log_filename
            if file_path.exists():
                file_path.unlink()

        self.stdout.write(f"{sub_name} のログファイルをリセットしました。ステージを1に戻します。")

    def setup_logger(self, group_name: str, sub_name: str, current_stage: int) -> logging.Logger:
        """
        ステージごとのログファイル (01{sub_name}.log など) をセットアップし、Logger を返す。
        """
        log_dir = self.get_log_dir(group_name, sub_name)
        log_dir.mkdir(parents=True, exist_ok=True)

        stage_log_filename = f"{current_stage:02d}{sub_name}.log"
        stage_log_path = log_dir / stage_log_filename

        logger_name = f"{group_name}_{sub_name}_logger"
        logger = logging.getLogger(logger_name)
        # すでにハンドラがあればクリア
        if logger.hasHandlers():
            logger.handlers.clear()
        logger.setLevel(logging.DEBUG)

        # タイムゾーン対応フォーマッタを使用
        formatter = TZFormatter(
            fmt="%(asctime)s [%(levelname)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S %Z"
        )

        file_handler = logging.FileHandler(stage_log_path, encoding="utf-8")
        file_handler.setFormatter(formatter)
        file_handler.setLevel(logging.DEBUG)
        logger.addHandler(file_handler)

        return logger

    async def handle_async(self, *args, **options) -> None:
        """
        非同期タスクのエントリーポイント。サブクラスで実装する。
        """
        raise NotImplementedError("サブクラスで handle_async を実装してください。")

    def handle(self, *args, **options) -> None:
        """
        同期メソッド → 非同期メソッドへ移行。
        """
        try:
            asyncio.run(self.handle_async(*args, **options))
        except Exception as e:
            self.stderr.write(f"エラーが発生しました: {e}")
