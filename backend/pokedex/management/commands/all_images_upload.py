import sys
import time
import asyncio
import aiohttp
import requests
from pathlib import Path
from django.core.management.base import BaseCommand
from google.cloud import storage
from tqdm import tqdm
import os

class Command(BaseCommand):
    help = 'PokeAPIからフォーム画像を取得し、Google Cloud Storageにアップロードします。（非同期処理・リトライ付き・全ID一括取得版）'

    def handle(self, *args, **options):
        # .envの読み込み（プロジェクトルートのconfig/.envを想定）
        env_path = Path(__file__).resolve().parent.parent.parent.parent / "config" / ".env"
        if env_path.exists():
            from dotenv import load_dotenv
            load_dotenv(dotenv_path=env_path)
            self.stdout.write(f".envファイルを読み込みました: {env_path}")
        else:
            self.stderr.write(f"[Warning] .envファイルが見つかりません: {env_path}")

        # ログ保存先ディレクトリの作成（プロジェクトのルートの2階層上に log/upload/）
        cwd = Path.cwd()
        log_dir = cwd.parent.parent / "log" / "upload"
        log_dir.mkdir(parents=True, exist_ok=True)
        self.stdout.write("処理開始：PokeAPIから画像URL取得 → GCSへアップロード")
        # get_form_urls() で書き込むファイルパス（ここでは統合したログファイル名とする）
        self.urls_file = log_dir / "form_urls.log"
        self.get_form_urls()
        self.upload_google_storage()
        self.stdout.write("処理完了")

    def get_all_ids(self):
        """
        PokeAPI の pokemon-form エンドポイントから全フォームのIDを一括取得する。
        APIの最初のレスポンスから総件数を取得し、その件数をlimitパラメータに指定して一度に全件のデータを取得します。
        Returns:
            List[dict]: 各フォームのデータ（例: {"url": "https://pokeapi.co/api/v2/pokemon-form/1/", ...}）
        """
        base_url = "https://pokeapi.co/api/v2/pokemon-form/"
        try:
            resp = requests.get(base_url, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            total = data.get("count")
            if not total:
                raise ValueError("count が取得できませんでした")
            # 一括取得
            url = f"{base_url}?limit={total}"
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            return data.get("results", [])
        except Exception as e:
            self.stderr.write(f"[Error] 全IDの一括取得に失敗: {e}\n")
            return []

    async def get_img_url_async(self, session, url, max_retries=3, retry_delay=2):
        """
        aiohttp を使い、指定されたフォーム詳細 URL から画像 URL を非同期に取得する。
        リトライロジックを追加しています。
        """
        for attempt in range(max_retries):
            try:
                async with session.get(url, timeout=10) as resp:
                    resp.raise_for_status()
                    data = await resp.json()
                    return data.get("sprites", {}).get("front_default", "")
            except Exception as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay)
                else:
                    self.stderr.write(f"[Error] {url} の非同期画像取得に失敗: {e}\n")
                    return ""

    def get_form_urls(self):
        """
        1. 全フォームのデータを一括取得し、各エントリのURLからIDを得る。
        2. 非同期で各フォームの詳細から画像URL を取得し、フォームURL と画像URL をファイルに書き出す。
        """
        base_url = "https://pokeapi.co/api/v2/pokemon-form/"
        forms = self.get_all_ids()
        count = 0

        async def process_forms():
            async with aiohttp.ClientSession() as session:
                tasks = []
                for form in forms:
                    form_url = form.get("url")
                    if form_url:
                        tasks.append(asyncio.create_task(self.get_img_url_async(session, form_url)))
                # 並列実行して各画像URLを取得
                results = await asyncio.gather(*tasks)
                # 結果は、forms の順序に沿った画像URLのリスト
                return [(form.get("url"), img_url) for form, img_url in zip(forms, results)]
        try:
            form_results = asyncio.run(process_forms())
            with self.urls_file.open("w", encoding="utf-8") as f:
                for form_url, img_url in form_results:
                    f.write(f"{form_url}, {img_url}\n")
                    count += 1
            self.stdout.write(f"全フォームの URL と画像URLを {self.urls_file} に保存しました。")
            self.stdout.write(f"取得件数: {count} 件")
        except Exception as e:
            self.stderr.write(f"[Fatal] get_form_urls() 内で予期しないエラーが発生: {e}\n")
            sys.exit(1)

    async def download_image_async(self, session, img_url, max_retries=3, retry_delay=2):
        """
        非同期に画像データをダウンロードする関数。
        リトライロジックを追加しています。
        画像データと Content-Type ヘッダーの値をタプルで返します。
        """
        for attempt in range(max_retries):
            try:
                async with session.get(img_url, timeout=10) as resp:
                    resp.raise_for_status()
                    content_type = resp.headers.get("Content-Type", "application/octet-stream")
                    data = await resp.read()
                    return data, content_type
            except Exception as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay)
                else:
                    self.stderr.write(f"[Error] {img_url} の非同期ダウンロードに失敗: {e}\n")
                    return None, None

    def upload_google_storage(self):
        """
        urls_file の各行から画像 URL を取得し、画像を非同期でダウンロード後、Google Cloud Storage にアップロードする。
        tqdm を利用して進捗状況を表示します。
        """
        BUCKET_NAME = "pokemon_front_img"  # ※実際のバケット名に変更してください
        try:
            client = storage.Client()
            bucket = client.bucket(BUCKET_NAME)
        except Exception as e:
            self.stderr.write(f"[Fatal] GCS クライアントの初期化に失敗: {e}\n")
            sys.exit(1)

        if not self.urls_file.exists():
            self.stderr.write(f"[Error] {self.urls_file} が見つかりません。\n")
            sys.exit(1)

        try:
            with self.urls_file.open("r", encoding="utf-8") as f:
                lines = f.readlines()
        except Exception as e:
            self.stderr.write(f"[Error] ファイルの読み込みに失敗: {e}\n")
            sys.exit(1)

        async def process_uploads():
            async with aiohttp.ClientSession() as session:
                for line in tqdm(lines, desc="Uploading images", unit="image"):
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        form_url, img_url = line.split(", ")
                    except ValueError:
                        self.stderr.write(f"[Warning] 行の形式が不正です: {line}\n")
                        continue
                    if not img_url:
                        self.stderr.write(f"[Warning] 画像URLが空です: {form_url}\n")
                        continue
                    image_data, content_type = await self.download_image_async(session, img_url)
                    if image_data is None:
                        continue
                    blob_name = img_url.split("/")[-1]
                    blob = bucket.blob(blob_name)
                    try:
                        blob.upload_from_string(image_data, content_type=content_type)
                    except Exception as e:
                        self.stderr.write(f"[Error] GCSへのアップロードに失敗: {blob_name} - {e}\n")
                        continue

        asyncio.run(process_uploads())
