import json
from pathlib import Path
from typing import Generator, Tuple, List, Dict
from tqdm import tqdm
import sys

###############################################################################
# 1) 基本的なユーティリティ関数
###############################################################################
def load_json_generator(directory: Path) -> Generator[Tuple[str, dict], None, None]:
    """
    指定したディレクトリの *.json ファイルを逐次読み込むジェネレータ。
    (ファイル名(拡張子抜き), JSONのdict) を yield する。
    """
    for json_file in directory.glob("*.json"):
        file_id = json_file.stem
        try:
            with json_file.open("r", encoding="utf-8") as f:
                data = json.load(f)
            yield file_id, data
        except Exception as e:
            print(f"[ERROR] {json_file}: {e}")


def extract_id_from_url(url: str) -> str:
    """
    URL の末尾から ID文字列を取得
    例: "https://pokeapi.co/api/v2/pokemon-form/123/" -> "123"
    """
    return url.rstrip("/").split("/")[-1]


def get_form_ja_name(form_data: dict) -> str:
    """
    フォームデータから、最終的に表示するフォーム名を返す。
    ロジック:
      1) form_names から 'ja-Hrkt' を探す → 見つかればそれ
      2) それ以外 → --- をそのまま返す

    """
    # まずは form_names で ja-Hrkt を探す
    for name_entry in form_data.get("form_names", []):
        lang_info = name_entry.get("language", {})
        if lang_info.get("name") == "ja-Hrkt":
            return name_entry.get("name", "---")
    return "---"
    
def get_form_en_name(form_data: dict):
    name = form_data.get("name","")
    form_name = form_data.get("form_name","")
    if form_name == "":
        return "---"
    else:
        return name
        

def get_species_ja_name(species_data: dict) -> str:
    """
    種族データ(ポケモン図鑑データ)から日本語名(ja-Hrkt)を取得。
    見つからない場合は species_data["name"]、それも無ければエラー終了。
    """
    for name_entry in species_data.get("names", []):
        lang_info = name_entry.get("language", {})
        if lang_info.get("name") == "ja-Hrkt":
            return name_entry.get("name", "")

    # フォールバック: "name" キー
    if "name" in species_data:
        return species_data["name"]

    print("[ERROR] No suitable JP name in species data.")
    sys.exit(1)


def sort_key(record: dict) -> Tuple[int, int, int]:
    """
    ソート用のキー (species_id, pokemon_id, form_id) を数値化して返す。
    """
    def to_int_safe(value: str) -> int:
        try:
            return int(value)
        except:
            return 999999

    species_id_int = to_int_safe(record.get("species_id", "999999"))
    pokemon_id_int = to_int_safe(record.get("pokemon_id", "999999"))
    form_id_int    = to_int_safe(record.get("form_id", "999999"))
    return (species_id_int, pokemon_id_int, form_id_int)


###############################################################################
# 2) レコード生成 (極力ネストを排し、フラットに進む)
###############################################################################
def generate_records(
    species_data_map: Dict[str, dict],
    pokemon_data_map: Dict[str, dict],
    form_data_map: Dict[str, dict]
) -> List[dict]:
    """
    上記3つのデータマップを参照し、result.json に入れるレコードを作る。
    - 入れ子を最小限にするため、条件が合わなければすぐ continue 。
    - variety_id → unique_id に変更。
    """
    all_records: List[dict] = []

    # unique_id 用カウンタ: (species_key, species_name_jp) -> int
    unique_counters: Dict[Tuple[str, str], int] = {}

    # species_data_map は例: {'00001': { ... }, '00002': {...} ...}
    # 数値化してソート
    species_keys = sorted(species_data_map.keys(), key=lambda x: int(x))

    for species_key in species_keys:
        species_data = species_data_map[species_key]
        species_name_jp = get_species_ja_name(species_data)
        species_json_file = f"pokemon-species/{species_key}.json"

        # バリエーション (varieties) 取得
        variety_list = species_data.get("varieties", [])
        if not variety_list:
            continue  # バリエーションが無ければ次へ

        for single_variety in variety_list:
            # ポケモンID を取得
            pokemon_url = single_variety.get("pokemon", {}).get("url", "")
            pokemon_id_str = extract_id_from_url(pokemon_url)
            if not pokemon_id_str:
                continue

            pokemon_json_file = f"pokemon-pokemon/{pokemon_id_str.zfill(5)}.json"

            # pokemon_data_map からポケモンデータを取得
            pokemon_data = pokemon_data_map.get(pokemon_id_str.zfill(5))
            if not pokemon_data:
                continue

            # フォーム情報
            form_list = pokemon_data.get("forms", [])
            if not form_list:
                continue

            # フォームを全部処理
            for single_form_info in form_list:
                form_url = single_form_info.get("url", "")
                form_id_str = extract_id_from_url(form_url)
                if not form_id_str:
                    continue

                form_json_file = f"pokemon-form/{form_id_str.zfill(5)}.json"
                single_form_data = form_data_map.get(form_id_str.zfill(5))
                if not single_form_data:
                    # フォームデータが無い場合
                    sys.exit(1)
                else:
                    # 正常にフォームデータがある場合
                    form_name_jp = get_form_ja_name(single_form_data)
                    form_name_en = get_form_en_name(single_form_data)

                # unique_id の生成: (species_key, 種族名)ごとに連番
                counter_key = (species_key, species_name_jp)
                if counter_key not in unique_counters:
                    unique_counters[counter_key] = 0
                else:
                    unique_counters[counter_key] += 1

                unique_index = unique_counters[counter_key]
                unique_id_value = f"{species_key}-{unique_index:02d}"

                # 出力レコード
                record = {
                    "unique_id": unique_id_value,               # ここが variety_id → unique_id に変更
                    "species_id": f"{int(species_key):04d}",
                    "pokemon_id": pokemon_id_str.zfill(5),
                    "form_id": form_id_str.zfill(5),

                    "ja": species_name_jp,
                    "sub_ja": form_name_jp,
                    "sub_en": form_name_en,

                    "species_json_file": species_json_file,
                    "pokemon_json_file": pokemon_json_file,
                    "form_json_file": form_json_file,
                }
                all_records.append(record)

    return all_records


###############################################################################
# 3) メイン処理
###############################################################################
def main():
    base_path = Path(r"C:\Users\ns69a\allpokemon\flask\files")
    species_dir = base_path / "pokemon-species"
    pokemon_dir = base_path / "pokemon-pokemon"
    form_dir    = base_path / "pokemon-form"

    # データ読み込み
    species_data_map: Dict[str, dict] = {}
    for file_id, data in tqdm(load_json_generator(species_dir), desc="loading species json"):
        species_data_map[file_id] = data

    pokemon_data_map: Dict[str, dict] = {}
    for file_id, data in tqdm(load_json_generator(pokemon_dir), desc="loading pokemon json"):
        pokemon_data_map[file_id] = data

    form_data_map: Dict[str, dict] = {}
    for file_id, data in tqdm(load_json_generator(form_dir), desc="loading form json"):
        form_data_map[file_id] = data

    # レコード生成 (unique_id 付き)
    all_records = generate_records(
        species_data_map=species_data_map,
        pokemon_data_map=pokemon_data_map,
        form_data_map=form_data_map
    )

    # ソート
    all_records.sort(key=sort_key)

    # JSON 書き出し
    output_file = Path("result.json")
    with output_file.open("w", encoding="utf-8") as f_out:
        json.dump(all_records, f_out, ensure_ascii=False, indent=2)

    print(f"\nDone! Created {output_file} with {len(all_records)} records.")

if __name__ == "__main__":
    main()
