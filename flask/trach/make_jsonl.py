import json
from pathlib import Path
from typing import Optional, Generator, Tuple, List, Dict
from tqdm import tqdm
import sys


def load_json_generator(directory_path: Path) -> Generator:
    for json_file_path in directory_path.glob("*.json"):
        file_id = json_file_path.stem
        try:
            with open(json_file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            yield file_id, data
        except Exception as e:
            print(f"ERROR {json_file_path} ]: {e}")
            
def extract_id_from_url(url: str) -> str:
    '''
    
    urlからidを抽出。idはstrだが、パディングされてない。
    
    '''
    id = url.rstrip("/").split("/")[-1]
    return id

def get_species_name(species_data: dict) -> str:
    '''
    
    species-jsonを探索する関数。
    返し値はエラーログ
    OR
    speciesのja-Hrkt
    == 原種フシギバナ、メガフシギバナ、フシギバナ（キョダイマックス）が、全て「フシギバナ」
    == マホイップは、どのデコレーションでも「マホイップ」（多いので驚かず！）
    == キュウコン、アローラキュウコン、は両者とも「キュウコン」
    
    '''
    # names値はリスト
    names = species_data.get["names",[]]
    if not names:
        return("namesキー無し/names値=リストなし")
    for entry in names:
        if entry["language"]["name"] == "ja-Hrkt":
            return entry["name"]
    # forを回しても日本語が見つからなかった場合
    return ("namesは有るがja-Hrktなし") 

def get_sub_name(form_data: dict, log_file) -> str:
    # 
    form_names = form_data.get("form_names", [])
    if not form_names:
        return("")

    if form_names:
        for name_entry in form_names:
            language_info = name_entry["language"]
            if language_info.get["name"] == "ja-Hrkt":
                return name_entry["name"]

        log_file.write(
            "form_names には日本語がありませんでした。\n"
            "せめてform_nameキーの出力を試みます。\n"
        )
    
    form_name = form_data.get("form_name", "")
    if not form_name:
        log_file.write("form_dataにform_nameキーが存在しません。\nこれは重大な例外です。")
    
    if form_name:
        return form_name
    
    return "予期せぬエラー"

def get_species_category(species_data: dict) -> str:
    baby = species_data["is_baby"]
    if baby:
        return "ベイビー"
    legendary = species_data["is_legendary"]
    if legendary:
        return "伝説"
    mythical = species_data["is_mythical"]
    if mythical:
        return "幻"
    return "普通"

def get_pokemon_moves(pokemon_data: dict, N: int) -> list[dict]:
    '''
    pokemonから、全てのmoveについて、[(id,name,url),(id,name,url)...]を取り出す。
    '''
    
    # 
    # "moves": [
    #     {
    #         "move": {
    #             "name": "swords-dance",
    #             "url": "https://pokeapi.co/api/v2/move/14/"
    #         },
    #         "version_group_details": [
    #             {
    #                 "level_learned_at": 0,
    #                 "move_learn_method": {
    #                     "name": "machine",
    #                     "url": "https://pokeapi.co/api/v2/move-learn-method/4/"
    #                 },
    #                 "version_group": {
    #                     "name": "red-blue",
    #                     "url": "https://pokeapi.co/api/v2/version-group/1/"
    #                 }
    #             },
    #             {
    #                 "level_learned_at": 0,
    #                 "move_learn_method": {
    #                     "name": "machine",
    #
                        
    moves_data = pokemon_data.get("moves",{})
    if not moves_data:
        return("pokemon-jsonのmovesキーに異常")
    moves_of_version_n = []
    # moves_dataはリスト、move_entryは辞書
    # リストの中に辞書が技の数だけ入っている
    for move_entry in moves_data:
        # forを回してurlをチェック
        try:
            for single_move_version_info in move_entry["version_group_details"]:
                move_version_url = single_move_version_info["version_group"]["url"]
                move_version_id = extract_id_from_url(move_version_url)
                if move_version_id == N:
                    id = extract_id_from_url(move_entry["move"]["url"])
                    name = move_entry["move"]["name"]
                    url = move_entry["move"]["url"]
                    result = (id, name, url)
                    moves_of_version_n.append(result)
        except:
            print("pokemon-jsonからの抽出関数のキーのタイポ可能性")
            
    return(moves_of_version_n)
                

def get_pokdex_info(species_data: dict) -> List[dict]:
    all_pokedex_info = species_data["pokedex_numbers"]
    if not all_pokedex_info:
        return {"error": "pokedex_numberキーが無い"}
    all_pokedex = []
    for single_pokedex_info in all_pokedex_info:
        pokedex_version_url = single_pokedex_info["pokedex"]["url"]
        pokedex_version = extract_id_from_url(pokedex_version_url)
        pokedex_id = single_pokedex_info["entry_number"]
        # Memo: dic={x:y}じゃないことを知った。
        dic = {pokedex_version, pokedex_id}
        all_pokedex.append(dic)
    if not all_pokedex:
        return {"Error": "SpeciesのPokedexのマージ中"}
    return all_pokedex
        

def generate_record_test(data_map) -> List[dict]:

    
def output_record_test(all_records: list):
    pass
    

