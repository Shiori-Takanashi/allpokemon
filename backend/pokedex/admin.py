from django.contrib import admin
from django.db.models.functions import Cast
from django.db.models import F, IntegerField
from pokedex.models import Pokemon
from django.utils.html import mark_safe

@admin.register(Pokemon)
class PokemonAdmin(admin.ModelAdmin):
    list_display = (
        "unique_id", "species_id", "pokemon_id", "form_id", "ja", "sub_ja",
        # "group","original", "is_pokemon_img", "is_form_img",
        "front_default_url"
        # "base_h", "base_a", "base_b", "base_c", "base_d", "base_s"
    )

    search_fields = ("ja", "sub_ja")
    ordering = ("unique_id",)
    
    def display_image_front(self, obj):
        if obj.image_front:
            return mark_safe(f'<img src="{obj.image_front.url}" style="max-height: 50px;"/>')
        elif obj.image_front_url:
            # image_front_url に GCS など外部のURLが登録されている場合
            return mark_safe(f'<img src="{obj.image_front_url}" style="max-height: 50px;"/>')
        return "(No image)"
    display_image_front.short_description = "Front Image"
    
    readonly_fields = [field.name for field in Pokemon._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
