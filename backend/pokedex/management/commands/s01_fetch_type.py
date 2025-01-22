# fetch_type.py
from backend.pokedex.management.commands.fetch_base_command import FetcherBaseCommand

class Command(FetcherBaseCommand):
    help = "Fetch raw Type data from PokeAPI"
    endpoint = "https://pokeapi.co/api/v2/type"  # 個別取得用
    list_endpoint = "https://pokeapi.co/api/v2/type?limit=100000&offset=0"
    datatype = "raw"
    output_parent_dir_name = "pokemon"
    output_dir_name = "type"