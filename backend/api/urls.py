from django.urls import path
from .views import (
    NationalPokemonListView,
    PaldeaPokemonListView,
    GalarPokemonListView,
)

urlpatterns = [
    path("national-pokemon/", NationalPokemonListView.as_view(), name="national-pokemon-list"),
    path("paldea-pokemon/", PaldeaPokemonListView.as_view(), name="paldea-pokemon-list"),
    path("galar-pokemon/", GalarPokemonListView.as_view(), name="galar-pokemon-list"),
]
