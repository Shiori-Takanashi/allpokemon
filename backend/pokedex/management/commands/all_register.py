import json
import re
import sys
from pathlib import Path
from typing import Generator, Tuple, List, Dict, Any

from django.core.management.base import BaseCommand
from django.db import transaction
from tqdm import tqdm

from pokedex.models import Pokemon


class Command(BaseCommand):
    """
    PokeAPIから取得したJSONデータを元に、Pokemonモデルを再構築するコマンド。

    1) JSONファイルを読み込む
    2) ポケモンのレコード（辞書リスト）を作成
    3) 既存のPokemonレコードを全削除
    4) 新しいレコードを一括登録
    5) 登録したレコードを確認用にJSON出力
    """

    help = "ポケモンのデータを統合し、既存レコードを全削除後にDBへ一括登録するスクリプト"

    # 地方図鑑の pokedex.name と、Pokemonモデルの対応フィールド名のマッピング
    POKEDEX_MAP = {
        "national": "national_dex",
        "paldea": "paldea_dex",
        "kitakami": "kitakami_dex",
        "blueberry": "blueberry_dex",
    }
    
    TYPE_MAP = {
        "normal":   "普",   # ノーマル
        "fire":     "炎",   # ほのお
        "water":    "水",   # みず
        "electric": "電",   # でんき
        "grass":    "草",   # くさ
        "ice":      "氷",   # こおり
        "fighting": "格",   # かくとう
        "poison":   "毒",   # どく
        "ground":   "地",   # じめん
        "flying":   "飛",   # ひこう
        "psychic":  "超",   # エスパー
        "bug":      "虫",   # むし
        "rock":     "岩",   # いわ
        "ghost":    "幽",   # ゴースト
        "dragon":   "竜",   # ドラゴン
        "dark":     "悪",   # あく
        "steel":    "鋼",   # はがね
        "fairy":    "妖",   # フェアリー
    }


    # 全角文字の例外判定用正規表現
    EXCEPTION_PATTERN = re.compile(
        r"^[\u3040-\u309F"   # ひらがな
        r"\u30A0-\u30FF"     # カタカナ
        r"\u3000-\u303F"     # 日本語の記号
        r"\uFF10-\uFF19"     # 全角数字
        r"\uFF21-\uFF3A"     # 全角英大文字
        r"\uFF41-\uFF5A"     # 全角英小文字
        r"\uFF01-\uFF0F"     # 全角記号
        r"\uFF1A-\uFF1F"     # 全角記号
        r"\uFF3B-\uFF40"     # 全角記号
        r"\uFF5B-\uFF60"     # 全角記号
        r"\uFFE0-\uFFE6"     # その他全角記号
        r"]+$"
    )

    def handle(self, *args, **options) -> None:
        base_path = Path.cwd() / "data" / "raw" / "pokemon"
        species_dir = base_path / "pokemon-species"
        pokemon_dir = base_path / "pokemon-pokemon"
        form_dir = base_path / "pokemon-form"
        output_dir = Path.cwd() / "data" / "merged"
        output_file = output_dir / "pokedex_check.json"
        output_dir.mkdir(exist_ok=True, parents=True)

        # 1) JSON読み込み
        species_data_map = dict(self.load_json_generator(species_dir, desc="Loading species json"))
        pokemon_data_map = dict(self.load_json_generator(pokemon_dir, desc="Loading pokemon json"))
        form_data_map = dict(self.load_json_generator(form_dir, desc="Loading form json"))

        # 2) レコード生成
        all_records = self.generate_records(
            species_data_map=species_data_map,
            pokemon_data_map=pokemon_data_map,
            form_data_map=form_data_map,
        )
        all_records.sort(key=self.sort_key)

        # 3) 確認用 JSON 出力
        with output_file.open("w", encoding="utf-8") as f_out:
            json.dump(all_records, f_out, ensure_ascii=False, indent=2)
        self.stdout.write(f"\nDone! Created {output_file} with {len(all_records)} records.\n")

        # 4) DB リフレッシュ（全削除 → bulk_create）
        self.refresh_database()
        self.register_database(all_records)

    # --------------------------------------------------
    # JSON 読み込み
    # --------------------------------------------------
    def load_json_generator(self, directory: Path, desc: str = "") -> Generator[Tuple[str, dict], None, None]:
        for json_file in tqdm(directory.glob("*.json"), desc=desc):
            file_id = json_file.stem
            try:
                with json_file.open("r", encoding="utf-8") as f:
                    data = json.load(f)
                yield file_id, data
            except Exception as e:
                self.stderr.write(f"[ERROR] {json_file}: {e}")

    # --------------------------------------------------
    # レコード生成
    # --------------------------------------------------
    def generate_records(
        self,
        species_data_map: Dict[str, dict],
        pokemon_data_map: Dict[str, dict],
        form_data_map: Dict[str, dict]
    ) -> List[dict]:
        all_records: List[dict] = []
        unique_counters: Dict[str, int] = {}

        # 例外名前出力用
        exception_dir = Path.cwd() / "data" / "exception"
        exception_dir.mkdir(exist_ok=True, parents=True)
        exception_file = exception_dir / "sub_ja.txt"
        exception_name_set = set()
        

        species_keys = sorted(species_data_map.keys(), key=lambda x: int(x))
        for species_key in species_keys:
            species_data = species_data_map[species_key]
            species_name_jp = self.get_species_ja_name(species_data)
            species_name_en = self.get_species_en_name(species_data)

            dex_info_list = self.get_dexes_numbers(species_data)
            dex_fields = self.parse_regional_dex(dex_info_list)
            species_json_file = f"pokemon-species/{species_key}.json"

            variety_list = species_data.get("varieties", [])
            if not variety_list:
                continue

            for single_variety in variety_list:
                pokemon_url = single_variety.get("pokemon", {}).get("url", "")
                pokemon_id_str = self.extract_id_from_url(pokemon_url)
                if not pokemon_id_str:
                    continue

                pokemon_json_file = f"pokemon-pokemon/{pokemon_id_str.zfill(5)}.json"
                pokemon_data = pokemon_data_map.get(pokemon_id_str.zfill(5))
                if not pokemon_data:
                    continue

                form_list = pokemon_data.get("forms", [])
                if not form_list:
                    continue

                for single_form_info in form_list:
                    form_url = single_form_info.get("url", "")
                    form_id_str = self.extract_id_from_url(form_url)
                    if not form_id_str:
                        continue

                    form_json_file = f"pokemon-form/{form_id_str.zfill(5)}.json"
                    single_form_data = form_data_map.get(form_id_str.zfill(5))
                    if not single_form_data:
                        sys.exit("[ERROR] Missing form data.")

                    form_name_jp = self.get_sub_ja(single_form_data)
                    form_name_en = self.get_sub_en(single_form_data)
                    if self.is_exception_name(form_name_jp):
                        exception_name_set.add(form_name_jp)

                    counter_key = f"{species_key}-{species_name_jp}"
                    unique_counters[counter_key] = unique_counters.get(counter_key, -1) + 1
                    unique_id_value = f"{species_key}-{unique_counters[counter_key]:02d}"

                    stats_fields = self.get_pokemon_stats(pokemon_data)
                    generation_fields = self.get_generation_flags(pokemon_data)
                    en_types = self.get_types(pokemon_data)
                    ja_types = self.translate_types(en_types)
                    abilities = self.get_abilities(pokemon_data)
                    
                    is_pokemon_img = self._is_pokemon_img(pokemon_data)
                    is_form_img = self._is_form_img(single_form_data)
                    
                    img_url = self.get_pokemon_img_url(pokemon_data)
                    
                    # 各辞書のキー名がモデルのフィールド名と一致するようアンパック
                    record = {
                        "unique_id": unique_id_value,
                        "species_id": f"{species_key.zfill(5)}",
                        "pokemon_id": pokemon_id_str.zfill(5),
                        "form_id": form_id_str.zfill(5),
                        "ja": species_name_jp,
                        "en": species_name_en,
                        "sub_ja": form_name_jp,
                        "sub_en": form_name_en,
                        "species_json_file": species_json_file,
                        "pokemon_json_file": pokemon_json_file,
                        "form_json_file": form_json_file,
                        "is_pokemon_img": is_pokemon_img,
                        "is_form_img": is_form_img,
                        "front_default_url": img_url,
                        **ja_types,
                        **abilities,
                        **stats_fields,
                        **generation_fields,
                        **dex_fields,
                    }


                    all_records.append(record)

        if exception_name_set:
            with exception_file.open("w", encoding="utf-8") as ef:
                for ex_name in sorted(exception_name_set):
                    ef.write(ex_name + "\n")

        return all_records

    # --------------------------------------------------
    # DB 更新
    # --------------------------------------------------
    def refresh_database(self) -> None:
        """既存のPokemonレコードをすべて削除する処理"""
        self.stdout.write("既存のレコードを削除中...")
        with transaction.atomic():
            Pokemon.objects.all().delete()
        self.stdout.write("レコード削除完了。")

    def register_database(self, records: List[dict]) -> None:
        """新しいレコードを一括登録する処理"""
        if not records:
            self.stdout.write("追加する新しいレコードはありません。")
            return

        new_pokemon_list = [
            Pokemon(**record)
            for record in tqdm(records, desc="新しいレコードを登録中")
        ]
        with transaction.atomic():
            Pokemon.objects.bulk_create(new_pokemon_list)
        self.stdout.write(f"{len(new_pokemon_list)} 件の新しいレコードをデータベースに追加しました。")


    # --------------------------------------------------
    # ユーティリティ
    # --------------------------------------------------
    def extract_id_from_url(self, url: str) -> str:
        return url.rstrip("/").split("/")[-1]

    def get_species_ja_name(self, species_data: dict) -> str:
        for name_info in species_data.get("names", []):
            if name_info.get("language", {}).get("name") == "ja-Hrkt":
                return name_info.get("name", "")
        return species_data.get("name", "")

    def get_species_en_name(self, species_data: dict) -> str:
        return species_data.get("name", "")

    def get_sub_ja(self, form_data: dict) -> str:
        for name_info in form_data.get("form_names", []):
            if name_info.get("language", {}).get("name") == "ja-Hrkt":
                return name_info.get("name", "")
        return form_data.get("form_name", "---")

    def get_sub_en(self, form_data: dict) -> str:
        return form_data.get("name", "")

    def get_types(self, pokemon_data: dict) -> dict:
        types = [entry.get("type", {}).get("name", "") for entry in pokemon_data.get("types", [])]
        return {
            "type_first": types[0] if len(types) > 0 else None,
            "type_second": types[1] if len(types) > 1 else None,
        }
        
    def translate_types(self, types: dict) -> dict:
        """
        get_types の返り値である辞書を受け取り、各タイプの値を TYPE_MAP を用いて翻訳し、
        同じキー構造の辞書を返す。
        """
        translated = {}
        for key, value in types.items():
            # 対応する翻訳があればそれを、なければそのままの値を設定
            translated[key] = self.TYPE_MAP.get(value, value)
        return translated
    
    def _is_pokemon_img(self, pokemon_data):
        p_sprites_front_default = pokemon_data.get("sprites", {}).get("front_default")
        if p_sprites_front_default is None:
            return False
        return True
    
    def _is_form_img(self, form_data):
        f_sprites_front_default = form_data.get("sprites", {}).get("front_default")
        if f_sprites_front_default is None:
            return False
        return True
    
    def get_pokemon_img_url(self, pokemon_data) -> str:
        sprites = pokemon_data.get("sprites",{})
        return sprites.get("front_default",None)
        
    
    def get_dexes_numbers(self, species_data: dict) -> List[Dict[str, Any]]:
        results = []
        for entry in species_data.get("pokedex_numbers", []):
            name = entry["pokedex"]["name"]
            num = entry["entry_number"]
            results.append({"dex-name": name, "dex-num": num})
        return results

    def parse_regional_dex(self, dex_info_list: List[Dict[str, Any]]) -> Dict[str, int]:
        result = {}
        for item in dex_info_list:
            dex_name = item["dex-name"]
            dex_num = item["dex-num"]
            if dex_name in self.POKEDEX_MAP:
                field_name = self.POKEDEX_MAP[dex_name]
                result[field_name] = dex_num
        return result

    def get_generation_flags(self, pokemon_data: dict) -> dict:
        """
        各世代の技の判定結果を、キーをモデルのフィールド名（generation_01～generation_09）とした辞書で返す
        """
        generation_mapping = {
            "exist_generation_01": ["red-blue", "yellow"],
            "exist_generation_02": ["gold-silver", "crystal"],
            "exist_generation_03": ["ruby-sapphire", "emerald"],
            "exist_generation_04": ["diamond-pearl", "platinum"],
            "exist_generation_05": ["black-white", "black-2-white-2"],
            "exist_generation_06": ["x-y"],
            "exist_generation_07": ["sun-moon", "ultra-sun-ultra-moon"],
            "exist_generation_08": ["sword-shield"],
            "exist_generation_09": ["scarlet-violet"],
        }
        moves = pokemon_data.get("moves", [])
        return {
            gen_key: any(
                version_info.get("version_group", {}).get("name", "") in target_versions
                for move in moves
                for version_info in move.get("version_group_details", [])
            )
            for gen_key, target_versions in generation_mapping.items()
        }

    def _is_pokemon_in_versions(self, pokemon_data: dict, target_versions: list) -> bool:
        moves = pokemon_data.get("moves", [])
        for move in moves:
            for version_info in move.get("version_group_details", []):
                if version_info.get("version_group", {}).get("name", "") in target_versions:
                    return True
        return False
    
    def moves_in_generations(self,pokemon_data: dict) -> list:
        pass
    
    def get_abilities(self, pokemon_data: dict) -> dict:
        entries = pokemon_data.get("abilities", [])
        abilities_dict = {}
        
        # 各エントリの slot 値をそのまま使ってキーを生成する
        for entry in entries:
            ability_name = entry.get("ability", {}).get("name", "")
            slot = entry.get("slot")
            if slot is not None:
                key = f"ability_{str(slot).zfill(2)}"
                abilities_dict[key] = ability_name

        # 重複チェック（例：slot 01 と slot 02 の値が同じなら slot 02 を None にする）
        if abilities_dict.get("ability_01", "") == abilities_dict.get("ability_02", ""):
            abilities_dict["ability_02"] = None

        if abilities_dict.get("ability_01", "") == abilities_dict.get("ability_03", ""):
            abilities_dict["ability_03"] = None

        if abilities_dict.get("ability_04", ""):
            del abilities_dict["ability_04"]
            pokemon_id = pokemon_data.get("id", "???")
            print(f"例外：四つ目の特性が{pokemon_id}に存在。記録はせず。要確認。")
        
        return abilities_dict


    def get_pokemon_stats(self, pokemon_data: dict) -> Dict[str, int]:
        base_stats = pokemon_data.get("stats", [])
        if len(base_stats) < 6:
            return {key: None for key in ["base_h", "base_a", "base_b", "base_c", "base_d", "base_s", "base_t"]}
        h, a, b, c, d, s = [stat["base_stat"] for stat in base_stats[:6]]
        return {
            "base_h": h,
            "base_a": a,
            "base_b": b,
            "base_c": c,
            "base_d": d,
            "base_s": s,
            "base_t": h + a + b + c + d + s,
        }

    def is_exception_name(self, name: str) -> bool:
        if not name:
            return False
        return not bool(self.EXCEPTION_PATTERN.fullmatch(name))

    def sort_key(self, record: dict) -> Tuple[int, int, int]:
        def to_int_safe(value: str) -> int:
            try:
                return int(value)
            except ValueError:
                return 999999
        return (
            to_int_safe(record.get("species_id", "999999")),
            to_int_safe(record.get("pokemon_id", "999999")),
            to_int_safe(record.get("form_id", "999999")),
        )
