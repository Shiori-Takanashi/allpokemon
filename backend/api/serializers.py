from rest_framework import serializers
from pokedex.models.pokemon import Pokemon

class DefaultSerializer(serializers.ModelSerializer):
    # カスタムフィールドの定義
    ids = serializers.SerializerMethodField()
    names = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    type_ = serializers.SerializerMethodField()
    abilities = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()
    exists_in_generations = serializers.SerializerMethodField()
    dex_numbers = serializers.SerializerMethodField()
    json_files = serializers.SerializerMethodField()

    class Meta:
        model = Pokemon
        # 必要なフィールドのみを明示的に指定（例）
        fields = [
            "original",
            "ids",
            "names",
            "images",
            "type_",
            "abilities",
            "stats",
            "exists_in_generations",
            "dex_numbers",
            "json_files",
        # カスタムフィールド以外に必要なモデルフィールドがあれば追加
        ]

    def get_ids(self, obj):
        return {
            "unique_id": obj.unique_id,
            "species_id": obj.species_id,
            "pokemon_id": obj.pokemon_id,
            "form_id": obj.form_id
        }

    def get_names(self, obj):
        return {
            "ja": obj.ja,
            "en": obj.en.capitalize(),
            "subJa": obj.sub_ja or "",
            "subEn": obj.sub_en.capitalize() if obj.sub_en else ""
        }

    def get_images(self, obj):
        return {
            "frontUrl": obj.front_default_url,
            "frontShinyUrl": obj.front_shiny_url
        }

    def get_type_(self, obj):
        return list(filter(None, [obj.type_first, obj.type_second]))

    def get_abilities(self, obj):
        return list(filter(None, [obj.ability_01, obj.ability_02, obj.ability_03]))

    def get_stats(self, obj):
        return {
            "hp": obj.base_h,
            "attack": obj.base_a,
            "defense": obj.base_b,
            "spAttack": obj.base_c,
            "spDefense": obj.base_d,
            "speed": obj.base_s,
            "total": obj.base_t
        }

    def get_exists_in_generations(self, obj):
        return [
            gen for gen in range(1, 10)
            if getattr(obj, f"exist_generation_0{gen}", False)
        ]

    def get_dex_numbers(self, obj):
        return {
            "national": obj.national_dex,
            "paldea": obj.paldea_dex,
            "kitakami": obj.kitakami_dex,
            "blueberry": obj.blueberry_dex
        }

    def get_json_files(self, obj):
        return {
            "species": obj.species_json_file,
            "pokemon": obj.pokemon_json_file,
            "form": obj.form_json_file
        }
