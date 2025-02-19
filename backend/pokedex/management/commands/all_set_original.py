from django.core.management.base import BaseCommand
from pokedex.models.pokemon import Pokemon

class Command(BaseCommand):
    help = (
        "全 Pokemon レコードについて、まず group と original を 初期化して設定。\n"

    )

    def handle(self, *args, **options):
        # 1. すべてのレコードの group と original を初期化（nullに設定）
        count_init = Pokemon.objects.all().update(group=None, original=None)
        self.stdout.write(f"Initialized {count_init} records: group and original set to null.")

        to_update = []

        # 2. species_id ごとに処理（各 species 内でグループ番号は 1 からスタート）
        species_ids = Pokemon.objects.values_list('species_id', flat=True).distinct()
        for species_id in species_ids:
            pokemons = list(Pokemon.objects.filter(species_id=species_id))
            # グループ化: キーは (ability_*, type_*, base_*, sub_ja_key) のタプル
            # sub_ja_key は、p.sub_ja が "gmax" の場合に "gmax"、それ以外は None とする
            groups = {}
            for p in pokemons:
                sub_ja_key = p.sub_ja if p.sub_ja == "gmax" else None
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
                    sub_ja_key,
                )
                groups.setdefault(key, []).append(p)

            group_number = 1  # species 内のグループ番号は 1 からスタート
            for key, group in groups.items():
                # 各グループのレコードにグループ番号を設定
                for p in group:
                    p.group = group_number

                if len(group) == 1:
                    # グループが1件の場合 → そのレコードを original=True とする
                    p = group[0]
                    p.original = True
                    self.stdout.write(f"Set {p.unique_id} original=True (unique group, group {group_number})")
                else:
                    # グループが複数件の場合
                    # まず、unique_id の末尾が "00" のレコードを抽出
                    records_00 = [p for p in group if p.unique_id[-2:] == "00"]
                    records_non00 = [p for p in group if p.unique_id[-2:] != "00"]

                    if records_00:
                        # グループ内に "00" レコードが存在する場合：
                        # → "00" レコードは必ず original=True
                        for p in records_00:
                            p.original = True
                            self.stdout.write(f"Set {p.unique_id} original=True ('00' record, group {group_number})")
                        # → その他（non-'00'）は original=False
                        for p in records_non00:
                            p.original = False
                            self.stdout.write(f"Set {p.unique_id} original=False (non-'00' record, group {group_number})")
                    else:
                        # グループ内に "00" レコードが存在しない場合：
                        # → 非 "00" レコードの中からソート順で最小のものを original=True とし、残りは original=False
                        non00_sorted = sorted(records_non00, key=lambda p: p.unique_id)
                        chosen = non00_sorted[0]
                        chosen.original = True
                        self.stdout.write(f"Set {chosen.unique_id} original=True (first non-'00', group {group_number})")
                        for p in non00_sorted[1:]:
                            p.original = False
                            self.stdout.write(f"Set {p.unique_id} original=False (non-'00' duplicate, group {group_number})")
                group_number += 1
                to_update.extend(group)

        # 3. bulk_update による一括更新（group, original 両方のフィールドを更新）
        if to_update:
            Pokemon.objects.bulk_update(to_update, ['group', 'original'])
            self.stdout.write(self.style.SUCCESS(f"Updated {len(to_update)} records with new group numbers and original flags."))
        else:
            self.stdout.write(self.style.SUCCESS("No records needed updating."))
