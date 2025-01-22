# fetch_pokemon.py
from backend.pokedex.management.commands.fetch_base_command import FetcherBaseCommand

class Command(FetcherBaseCommand):
    help = "Fetch raw Moves data from PokeAPI"
    endpoint = "https://pokeapi.co/api/v2/move"  # 個別取得用
    list_endpoint = "https://pokeapi.co/api/v2/move?limit=100000&offset=0"
    output_parent_dir_name = "move"
    output_dir_name = "move"