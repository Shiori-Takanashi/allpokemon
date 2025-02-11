from django.urls import path
from .views import (
    AllPokemonListView,
    PaldeaPokemonListView,
    GalarPokemonListView,
    RandomSinglePokemonView,
    DefaultView
)

urlpatterns = [
    path("default/",DefaultView.as_view(),name="default-view"),
    path("random-single-pokemon/",RandomSinglePokemonView.as_view(),name="random-single-pokemon"),
    path("national-pokemon/", AllPokemonListView.as_view(), name="national-pokemon-list"),
    path("paldea-pokemon/", PaldeaPokemonListView.as_view(), name="paldea-pokemon-list"),
    path("galar-pokemon/", GalarPokemonListView.as_view(), name="galar-pokemon-list"),
]
