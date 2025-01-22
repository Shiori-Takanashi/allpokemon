# fetch_pokemon.py
from backend.pokedex.management.commands.fetch_base_command import FetcherBaseCommand

class Command(FetcherBaseCommand):
    help = "Fetch raw Pokemon-Form data from PokeAPI"
    endpoint = "https://pokeapi.co/api/v2/pokemon-form"  # 個別取得用
    list_endpoint = "https://pokeapi.co/api/v2/pokemon-form?limit=100000&offset=0"
    output_parent_dir_name = "pokemon"
    output_dir_name = "form"