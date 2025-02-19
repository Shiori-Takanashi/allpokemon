from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from pokedex.models.pokemon import Pokemon
from .serializers import DefaultSerializer

# ページネーション（同じ）
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from pokedex.models.pokemon import Pokemon
from .serializers import DefaultSerializer

from rest_framework.pagination import LimitOffsetPagination

class StandardResultsSetPagination(LimitOffsetPagination):
    # デフォルトで1ページあたり24件表示
    default_limit = 24
    # クエリパラメータ名を 'limit' に設定
    limit_query_param = 'limit'
    # クエリパラメータ名を 'offset' に設定
    offset_query_param = 'offset'
    # 最大件数は72件までとする
    max_limit = 72

class BasePokemonListView(ListAPIView):
    """
    シリアライザーによるデータ加工をそのまま利用するベースクラスです。
    - サブクラスは build_queryset() を実装して、各エンドポイント固有の条件を追加してください。
    - 本クラスで、ステータスに対する op/line のフィルタを行います。
    """
    serializer_class = DefaultSerializer
    pagination_class = StandardResultsSetPagination

    # 省略時のデフォルト値を設定する必要があるならここで指定（op/lineともに省略が基本なのでとりあえずNone）
    h_op = None
    h_line = None
    a_op = None
    a_line = None
    b_op = None
    b_line = None
    c_op = None
    c_line = None
    d_op = None
    d_line = None
    s_op = None
    s_line = None
    t_op = None
    t_line = None

    def build_queryset(self):
        """
        サブクラスで実装予定。
        """
        raise NotImplementedError("Subclasses must implement build_queryset()")

    def get_queryset(self):
        # 1) ベースのクエリセットを取得（サブクラスで固有の条件を付与）
        qs = self.build_queryset()

        # 2) 画像URLが存在するものに限定
        qs = qs.filter(front_default_url__isnull=False).exclude(front_default_url__exact="")

        # 3) ステータスごとの op / line をフィルタリング
        qs = self.filter_stats(qs)

        return qs

    def filter_stats(self, qs):
        """
        h_op, h_line, a_op, a_line, ..., t_op, t_line
        といったクエリパラメータを解析して、フィルタに反映する。
        op が「gte」「lte」「eq」のいずれかであれば適用、それ以外や未指定の場合は無視。
        """
        # まずはクエリパラメータから取得
        request = self.request
        # "h_op", "h_line" のようなキーをループでまとめて処理できるよう、マッピングを定義
        stat_mapping = {
            'h': 'base_h',
            'a': 'base_a',
            'b': 'base_b',
            'c': 'base_c',
            'd': 'base_d',
            's': 'base_s',
            't': 'base_t',
        }

        for short_key, field_name in stat_mapping.items():
            op_key = f"{short_key}_op"     # 例: "h_op"
            line_key = f"{short_key}_line" # 例: "h_line"

            op_value = request.query_params.get(op_key, None)
            line_value = request.query_params.get(line_key, None)

            if not op_value or not line_value:
                # どちらか欠けていればスキップ
                continue

            # オペレーターが "gte", "lte", "eq" のいずれかであれば適用
            if op_value not in ["gte", "lte", "eq"]:
                continue

            # 数値に変換できなければスキップ
            try:
                line_int = int(line_value)
            except ValueError:
                continue

            # フィールドに対するフィルタ式を組み立て
            if op_value == "eq":
                # 等しい (=)
                filter_expr = {field_name: line_int}
            else:
                # "gte" or "lte"
                filter_expr = {f"{field_name}__{op_value}": line_int}

            qs = qs.filter(**filter_expr)

        return qs


# ----- 各地方のビュー -----

class NationalPokemonListView(BasePokemonListView):
    def build_queryset(self):
        # original=True かつ sub_ja に英字が含まれないポケモンを全国版として返す例
        return Pokemon.objects.filter(
            original=True
        ).filter(
            ~Q(sub_ja__iregex=r'[A-Za-z]')
        ).order_by("ja")


class GalarPokemonListView(BasePokemonListView):
    def build_queryset(self):
        return Pokemon.objects.filter(
            exist_generation_08=True
        ).filter(
            ~Q(sub_ja__icontains="メガ"),
            ~Q(sub_ja__iregex=r'[A-Za-z]') | Q(sub_ja="gmax")
        ).order_by("ja")


class PaldeaPokemonListView(BasePokemonListView):
    def build_queryset(self):
        return Pokemon.objects.filter(
            exist_generation_09=True
        ).filter(
            ~Q(sub_ja__icontains="メガ"),
            ~Q(sub_ja__iregex=r'[A-Za-z]')
        ).order_by("ja")
