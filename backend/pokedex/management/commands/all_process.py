import asyncio
from django.core.management import BaseCommand, call_command
from django.contrib.auth import get_user_model
from pokedex.management.commands.fetch_pokemon import Command as FetchPokemon
from pokedex.management.commands.fetch_games import Command as FetchGames
from pokedex.management.commands.fetch_move import Command as FetchMove

class Command(BaseCommand):
    help = "fetch系実行後、DB登録・更新、マイグレーション、superuser作成を順次実施します。"

    def handle(self, *args, **options):
        try:
            asyncio.run(self.run_fetch_commands())
        except Exception as e:
            self.stderr.write(f"fetch処理中にエラーが発生: {e}")
            return

        try:
            call_command("all_register")
        except Exception as e:
            self.stderr.write(f"all_register実行中にエラーが発生: {e}")
            return

        try:
            call_command("all_set_original")
        except Exception as e:
            self.stderr.write(f"all_set_original実行中にエラーが発生: {e}")
            return

        try:
            call_command("makemigrations")
        except Exception as e:
            self.stderr.write(f"makemigrations実行中にエラーが発生: {e}")
            return

        try:
            call_command("migrate")
        except Exception as e:
            self.stderr.write(f"migrate実行中にエラーが発生: {e}")
            return

        try:
            User = get_user_model()
            if not User.objects.filter(username="shiori").exists():
                User.objects.create_superuser(username="shiori", email="example@example.jp", password="0000")
        except Exception as e:
            self.stderr.write(f"superuser作成中にエラーが発生: {e}")
            return

        self.stdout.write("プロセスが完了しました。")

    async def run_fetch_commands(self):
        fetch_pokemon = FetchPokemon()
        fetch_games = FetchGames()
        fetch_move = FetchMove()
        await asyncio.gather(
            fetch_pokemon.handle_async(sub_name="all"),
            fetch_games.handle_async(sub_name="all"),
            fetch_move.handle_async(sub_name="all")
        )