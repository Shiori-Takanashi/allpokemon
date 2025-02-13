from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from pokedex.models import Pokemon
from .serializers import AllPokemonDexSerializer, SinglePokemonSerializer,  DefaultSerializer
from django.db.models import Q
from typing import final  # Python 3.8以降のみ有効

import random

class DefaultView(ListAPIView):
        queryset = Pokemon.objects.all()
        serializer_class =  DefaultSerializer

class RandomSinglePokemonView(APIView):
    def get(self, request, format=None):
        unique_id = request.query_params.get('unique_id', None)
        if unique_id:
            try:
                pokemon = Pokemon.objects.get(unique_id=unique_id)
            except Pokemon.DoesNotExist:
                return Response(
                    {"error": f"unique_id {unique_id} のポケモンが存在しません。"},
                    status=404
                )
        else:
            # ランダムに1件取得する（小規模なテーブルの場合は order_by('?') でもOK）
            pokemon = Pokemon.objects.order_by('?').first()
            if not pokemon:
                return Response({"error": "ポケモンのデータが存在しません。"}, status=404)
        
        serializer = SinglePokemonSerializer(pokemon)
        return Response(serializer.data)


class BasePokemonListView(ListAPIView):
    """
    共通の list() メソッドとレスポンス用辞書生成処理を定義する基底クラス。
    サブクラスでは get_queryset() のみを定義してください。

    ※ get_result() は全クラスで共通の処理とするため、override しないでください。
    """
    serializer_class = DefaultSerializer
    total_line = 0  # 例：TOTAL_LINEの値（必要に応じて変更）

    @final
    def get_result(self, pokemon):
        """
        各 Pokemon インスタンスからレスポンス用の辞書を生成する共通処理。
        sub_ja に「メガ」が含まれる場合はその値を name とし、
        それ以外は "ja(sub_ja)" 形式で name を生成します。
        """
        name = (
            pokemon.sub_ja
            if pokemon.sub_ja and "メガ" in pokemon.sub_ja
            else f"{pokemon.ja}({pokemon.sub_ja})" if pokemon.sub_ja else pokemon.ja
        )

        return {
            "unique_id": pokemon.unique_id,
            "name": name,
            "sub_ja": pokemon.sub_ja,
            "TYPE01": pokemon.type_first,
            "TYPE02": pokemon.type_second,
            "base_h": pokemon.base_h,
            "base_a": pokemon.base_a,
            "base_b": pokemon.base_b,
            "base_c": pokemon.base_c,
            "base_d": pokemon.base_d,
            "base_s": pokemon.base_s,
            "base_t": pokemon.base_t,
            "img": pokemon.front_default_url  # 画像URLフィールド
        }

    def list(self, request, *args, **kwargs):
        # get_queryset() で取得したクエリセットから、front_default_url が
        # null でなく、かつ空文字（""）ではないものだけをフィルタリング
        queryset = (
            self.get_queryset()
            .filter(front_default_url__isnull=False)
            .exclude(front_default_url__exact="")
        )
        results = [self.get_result(pokemon) for pokemon in queryset]
        return Response(results)

    

    
class AllPokemonListView(BasePokemonListView):
    """
    すべてのポケモンを取得するビュー。
      - 条件: base_t > total_line, original=True
      - 除外: sub_ja にローマ字（英字）が含まれるものを除外
    """
    def get_queryset(self):
        return Pokemon.objects.filter(
            base_t__gt=self.total_line,
            original=True
        ).filter(
            ~Q(sub_ja__iregex=r'[A-Za-z]')
        ).order_by("ja")

class GalarPokemonListView(BasePokemonListView):
    """
    ガラル地方のポケモンを取得するビュー。
      - 追加条件: exist_generation_08=True
      - 除外: sub_ja に「メガ」を含むものや、ローマ字（"gmax" は除外対象外）の条件を適用
    """
    def get_queryset(self):
        return Pokemon.objects.filter(
            base_t__gt=self.total_line,
            original=True,
            exist_generation_08=True
        ).filter(
            ~Q(sub_ja__icontains="メガ"),
            ~Q(sub_ja__iregex=r'[A-Za-z]') | Q(sub_ja="gmax")
        ).order_by("ja")

class PaldeaPokemonListView(BasePokemonListView):
    """
    パルデア地方のポケモンを取得するビュー。
      - 必要に応じて exist_generation_09=True などの条件を追加可能
      - 除外: sub_ja に「メガ」を含むもの、またはローマ字（英字）が含まれるものを除外
    """
    def get_queryset(self):
        return Pokemon.objects.filter(
            base_t__gt=self.total_line,
            original=True,
            exist_generation_09=True  # 条件が必要な場合はコメント解除
        ).filter(
            ~Q(sub_ja__icontains="メガ"),
            ~Q(sub_ja__iregex=r'[A-Za-z]')
        ).order_by("ja")
