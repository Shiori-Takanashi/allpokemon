import json
from pathlib import Path
from typing import Generator, Tuple, List, Dict
from tqdm import tqdm
import sys

###############################################################################
# 1) ユーティリティ関数
###############################################################################

def load_json_generator(directory_path: Path) -> Generator[Tuple[str, dict], None, None]:
    """
    指定したディレクトリの *.json ファイルを逐次読み込み、
    (file_id, JSONデータ) を yield するジェネレータ。
    """
    for json_file_path in directory_path.glob("*.json"):
        file_id = json_file_path.stem
        try:
            with open(json_file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            yield file_id, data
        except Exception as e:
            print(f"ERROR [{json_file_path} ]: {e}")

def extract_id_from_url(url: str) -> str:
    """
    URLの末尾からIDを抽出。例: "https://pokeapi.co/api/v2/pokemon-form/123/" -> "123"
    """
    return url.rstrip("/").split("/")[-1]

###############################################################################
# 2) データ抽出関数
###############################################################################

def get_species_name(species_data: dict) -> str:
    """
    species-json を探索し、日本語(ja-Hrkt)名を返す。
    無ければメッセージ(例: "namesキー無し/リストなし")などを返す。
    """
    names = species_data.get("names", [])
    if not names:
        return "namesキー無し / リストなし"
    for entry in names:
        if entry.get("language", {}).get("name") == "ja-Hrkt":
            return entry.get("name", "")
    return "namesは有るがja-Hrktなし"

def get_sub_name(form_data: dict, log_file) -> str:
    """
    form_data から日本語(ja-Hrkt)フォーム名を取得。無ければ form_name を使う。
    ログファイルに情報を書き込む例を兼ねている。
    """
    form_names = form_data.get("form_names", [])
    if not form_names:
        return ""

    # form_names に内容があれば ja-Hrkt を探す
    for name_entry in form_names:
        language_info = name_entry.get("language", {})
        if language_info.get("name") == "ja-Hrkt":
            return name_entry.get("name", "")

    # ここまで来たら日本語名が無かった
    log_file.write(
        "form_names には日本語がありませんでした。\n"
        "せめて form_name キーの出力を試みます。\n"
    )
    form_name = form_data.get("form_name", "")
    if not form_name:
        log_file.write("form_data に form_name キーが存在しません。重大な例外です。\n")
        return "予期せぬエラー"
    return form_name

def get_pokemon_moves(pokemon_data: dict, N: int) -> List[tuple]:
    """
    ポケモンデータから、バージョングループID=N で覚える技を抽出。
    [(技id, 技名, 技URL), ...] を返す。
    """
    moves_data = pokemon_data.get("moves", [])
    if not isinstance(moves_data, list):
        # "moves"キーが無い or 構造がリストでない時の例外対応
        return []

    moves_of_version_n = []
    for move_entry in moves_data:
        try:
            version_details = move_entry["version_group_details"]
            for single_move_version_info in version_details:
                move_version_url = single_move_version_info["version_group"]["url"]
                move_version_id = extract_id_from_url(move_version_url)
                # バージョングループIDが N かどうか比較
                if move_version_id == str(N):
                    move_id = extract_id_from_url(move_entry["move"]["url"])
                    move_name = move_entry["move"]["name"]
                    move_url = move_entry["move"]["url"]
                    moves_of_version_n.append((move_id, move_name, move_url))
        except KeyError:
            print("pokemon-json からの抽出中にキーエラー。構造が想定外かも。")
    
    return moves_of_version_n

def get_pokdex_info(species_data: dict) -> List[Dict[str, str]]:
    """
    species_data['pokedex_numbers'] から図鑑情報をまとめて返す。
    [{"pokedex_version": X, "pokedex_id": Y}, ...] のリスト。
    """
    all_pokedex_info = species_data.get("pokedex_numbers", [])
    if not all_pokedex_info:
        return [{"error": "pokedex_numberキーが無い"}]

    all_pokedex = []
    for single_pokedex_info in all_pokedex_info:
        pokedex_version_url = single_pokedex_info.get("pokedex", {}).get("url", "")
        pokedex_version = extract_id_from_url(pokedex_version_url)
        pokedex_id = single_pokedex_info.get("entry_number", "")
        # 辞書で返す { "pokedex_version": XX, "pokedex_id": YY }
        dic = {
            "pokedex_version": pokedex_version,
            "pokedex_id": pokedex_id
        }
        all_pokedex.append(dic)

    return all_pokedex

###############################################################################
# 3) レコード生成関数 (テスト用)
###############################################################################

def generate_record_test(pokemon_map: Dict[str, dict], N: int) -> List[dict]:
    """
    pokemon_map から各ポケモンの技を抽出し、レコードを生成する。
    N: バージョングループID
    """
    all_records = []

    for pokemon_id in sorted(pokemon_map.keys()):
        pokemon_data = pokemon_map[pokemon_id]
        # 種族名やカテゴリはここでは取得しない (pokemon-pokemon データのみ)
        # 必要に応じて他のマップからデータを取得する

        # 技を取得
        moves = get_pokemon_moves(pokemon_data, N)
        
        # レコード作成
        record = {
            "pokemon_id": pokemon_id,
            "moves_for_version_group": moves
        }
        all_records.append(record)
    
    return all_records

###############################################################################
# 4) 出力関数
###############################################################################

def output_record_test(all_records: List[dict], output_json_name: str = "result_pokemon_moves.json"):
    """
    生成済みのレコードを JSON で出力する例。
    """
    if not all_records:
        print("レコードが空です。特に出力は行いません。")
        return

    output_path = Path(output_json_name)
    with output_path.open("w", encoding="utf-8") as f_out:
        json.dump(all_records, f_out, ensure_ascii=False, indent=2)

    print(f"Done! {len(all_records)}件のレコードを {output_path} に書き出しました。")

###############################################################################
# 5) メイン関数
###############################################################################

def main():
    """
    メイン関数: files/pokemon-pokemon ディレクトリから JSON を読み込み、
    get_pokemon_moves をテスト実行し、結果を出力。
    """
    # テスト対象ディレクトリ
    pokemon_dir = Path("files") / "pokemon-pokemon"

    if not pokemon_dir.exists() or not pokemon_dir.is_dir():
        print(f"ERROR: ディレクトリ {pokemon_dir} が存在しないか、ディレクトリではありません。")
        sys.exit(1)

    # バージョングループIDを指定 (例: 1)
    N = 25
    print(f"バージョングループID=N={N} で技を抽出します。")

    # ポケモンデータを読み込む
    pokemon_map = {}
    for file_id, data in tqdm(load_json_generator(pokemon_dir), desc="loading pokemon data"):
        pokemon_map[file_id] = data

    # レコード生成
    all_records = generate_record_test(pokemon_map, N)

    # 出力
    output_record_test(all_records, output_json_name="result_pokemon_moves.json")

if __name__ == "__main__":
    main()
