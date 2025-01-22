from io import StringIO
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command


class Command(BaseCommand):
    """
    全ての 'move' サブエンドポイントの RAW JSON を一挙にフェッチするコマンド。
    個別の fetch_move コマンドを順次実行します。
    """

    help: str = "Fetch RAW JSON data for all 'move' sub-endpoints."

    def handle(self, *args, **options) -> None:
        # fetch_move.py だけを対象にする（MOVE_ENDPOINTSの定義に基づく）
        sub_endpoints = [
            "move",
            "move-ailment",
            "move-battle-style",
            "move-categories",
            "move-damage-class",
            "move-learn-method",
        ]

        stdout_messages = []

        for sub_name in sub_endpoints:
            try:
                # StringIOを使ってfetch_moveコマンドの標準出力をキャプチャ
                out = StringIO()
                self.stdout.write(f"=== Fetching {sub_name} ===")
                call_command('fetch_move', sub_name, stdout=out)
                # キャプチャした出力を取得
                output = out.getvalue()
                stdout_messages.append(f"=== Finished {sub_name} ===\n{output}")
            except CommandError as e:
                error_msg = f"Command 'fetch_move' for '{sub_name}' failed: {e}"
                self.stderr.write(error_msg)
                stdout_messages.append(error_msg)
            except Exception as e:
                error_msg = f"Unexpected error while fetching '{sub_name}': {e}"
                self.stderr.write(error_msg)
                stdout_messages.append(error_msg)

        # 全てのフェッチが完了した後にバッファされたメッセージをまとめて出力
        if stdout_messages:
            self.stdout.write("\n".join(stdout_messages))

        self.stdout.write("=== All fetch_move_all commands completed! ===")
