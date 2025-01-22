# fetch_all.py
import os
import importlib
import glob
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    """
    全リソースの RAW JSON を一挙にフェッチするコマンド。
    個別に fetch_pokemon.py などを呼び出すだけ。
    """
    help = "Fetch RAW JSON data for all resources."

    def handle(self, *args, **options):
        # 現在のディレクトリ（management/commands）のパスを取得
        commands_dir = os.path.dirname(__file__)
        
        # fetch_で始まり.pyで終わる全てのファイルを検索+
        pattern = os.path.join(commands_dir, '*_fetch_*.py')
        fetch_files = glob.glob(pattern)

        for fetch_file in fetch_files:
            module_name = os.path.splitext(os.path.basename(fetch_file))[0]
            
            # 自分自身（fetch_all.py）はスキップ
            if module_name == 'fetch_all':
                continue

            # モジュールのパスを構築（例: 'your_app.management.commands.fetch_pokemon'）
            module_path = f"{__package__}.{module_name}"
            try:
                # モジュールをインポート
                module = importlib.import_module(module_path)
                
                # モジュール内のCommandクラスを取得
                fetch_command_class = getattr(module, 'Command', None)
                if fetch_command_class is None:
                    self.stdout.write(f"Module '{module_name}' に Command クラスが見つかりません。")
                    continue

                # Commandクラスのインスタンスを作成
                fetch_command = fetch_command_class()
                
                # ハンドルメソッドを実行
                self.stdout.write(f"=== Fetching {module_name} ===")
                fetch_command.handle()
                self.stdout.write(f"=== Finished {module_name} ===\n")
            
            except Exception as e:
                self.stderr.write(f"Module '{module_name}' のフェッチ中にエラーが発生しました: {e}")

        self.stdout.write("=== All fetchers completed! ===")
