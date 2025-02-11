# your_app/management/commands/all_set_original.py

from django.core.management.base import BaseCommand
from pokedex.models import Pokemon

class Command(BaseCommand):
    help = (
        "species_id 内で、各レコードの (ability_*, type_*, base_*) の組み合わせがユニークな場合は "
        "original=True、複数ある場合は original=False に設定します。ただし、"
        "unique_id の下二桁が '00' の場合は、常に original=True とします。"
    )

    def handle(self, *args, **options):
        # 事前チェック: original フィールドが定義されているか確認
        try:
            Pokemon._meta.get_field("original")
        except Exception as e:
            self.stdout.write(self.style.ERROR("Pokemonモデルに 'original' フィールドが定義されていません。"))
            return

        # 更新対象のオブジェクトを格納するリスト
        to_update = []

        # species_id の一覧を取得
        species_ids = Pokemon.objects.values_list('species_id', flat=True).distinct()
        
        for species_id in species_ids:
            pokemons = list(Pokemon.objects.filter(species_id=species_id))
            
            # unique_id の下二桁が "00" のレコードを special_pokemons とする
            special_pokemons = [p for p in pokemons if p.unique_id[-2:] == "00"]
            # それ以外は normal_pokemons
            normal_pokemons  = [p for p in pokemons if p.unique_id[-2:] != "00"]

            # special_pokemons は常に original=True
            for p in special_pokemons:
                if p.original is not True:
                    p.original = True
                    to_update.append(p)
                    self.stdout.write(f"Set {p.unique_id} original=True (special)")

            # normal_pokemons は、指定の各フィールドの組み合わせでグループ化
            aggregated_dict = {}
            for p in normal_pokemons:
                key = (
                    p.ability_01,
                    p.ability_02,
                    p.ability_03,
                    p.type_first,
                    p.type_second,
                    p.base_h,
                    p.base_a,
                    p.base_b,
                    p.base_c,
                    p.base_d,
                    p.base_s,
                )
                aggregated_dict.setdefault(key, []).append(p)
            
            # グループごとに original フラグを設定
            for group, p_list in aggregated_dict.items():
                if len(p_list) == 1:
                    # この組み合わせが species 内で1件のみ → original=True
                    p = p_list[0]
                    if p.original is not True:
                        p.original = True
                        to_update.append(p)
                        self.stdout.write(f"Set {p.unique_id} original=True (unique group)")
                else:
                    # 同じ組み合わせが複数 → original=False とする
                    for p in p_list:
                        if p.original is not False:
                            p.original = False
                            to_update.append(p)
                            self.stdout.write(f"Set {p.unique_id} original=False (duplicate group)")
        
        # bulk_update による一括更新（更新対象がある場合）
        if to_update:
            Pokemon.objects.bulk_update(to_update, ['original'])
            self.stdout.write(self.style.SUCCESS(f"Updated {len(to_update)} records."))
        else:
            self.stdout.write(self.style.SUCCESS("No records needed updating."))
