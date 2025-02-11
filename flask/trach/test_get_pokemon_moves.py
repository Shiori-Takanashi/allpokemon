import pytest
from make_jsonl import load_json_generator, get_pokemon_moves
from pathlib import Path

pokemon_dir = Path.cwd().parent.parent / "files" / "pokemon-pokemon"

pokemon_data_map = {}
for file_id, data in load_json_generator(pokemon_dir):
    pokemon_data_map[file_id] = data
    
