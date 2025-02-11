from django.db import models

class Pokemon(models.Model):
    unique_id = models.CharField(max_length=10, unique=True, primary_key=True)
    species_id = models.CharField(max_length=4)
    pokemon_id = models.CharField(max_length=5)
    form_id = models.CharField(max_length=5)
    
    image_front_name = models.CharField(max_length=24,blank=True,null=True)
    image_front_url = models.URLField(max_length=500,blank=True,null=True)
    image_front = models.ImageField(upload_to='images/front/', blank=True, null=True)  # GCSに保存される例
    
    ja = models.CharField(max_length=100)
    en = models.CharField(max_length=100)
    sub_ja = models.CharField(max_length=100, null=True, blank=True)
    sub_en = models.CharField(max_length=100, null=True, blank=True)
    
    type_first = models.CharField(max_length=24,null=True, blank=True)
    type_second = models.CharField(max_length=24,null=True, blank=True)
    
    ability_01 = models.CharField(max_length=24,null=True,blank=True)
    ability_02 = models.CharField(max_length=24,null=True,blank=True)
    ability_03 = models.CharField(max_length=24,null=True,blank=True)
    
    is_pokemon_img = models.BooleanField(blank=True,null=True)
    is_form_img = models.BooleanField(blank=True,null=True)
    front_default_url = models.CharField(max_length=200,blank=True,null=True)
    front_shiny_url = models.CharField(max_length=200,blank=True,null=True)
    
    # pokemonごとの種族値
    base_h = models.IntegerField(null=True, blank=True)   # HP
    base_a = models.IntegerField(null=True, blank=True)  # 攻撃
    base_b = models.IntegerField(null=True, blank=True)  # 防御
    base_c = models.IntegerField(null=True, blank=True)  # 特攻
    base_d = models.IntegerField(null=True, blank=True)  # 特防
    base_s = models.IntegerField(null=True, blank=True)  # 素早さ
    base_t = models.IntegerField(null=True, blank=True)  # 種族値の合計
    
    group = models.IntegerField(null=True,blank=True)
    original = models.BooleanField(blank=True,null=True)
    
    exist_generation_01 = models.BooleanField(null=True, blank=True)  # red-blue (blue)
    exist_generation_02 = models.BooleanField(null=True, blank=True)  # gold-silver (=> crystal)
    exist_generation_03 = models.BooleanField(null=True, blank=True)  # ruby-sapphire (=> emerald)
    exist_generation_04 = models.BooleanField(null=True, blank=True)  # diamond-pearl (=> platinum)
    exist_generation_05 = models.BooleanField(null=True, blank=True)  # black-white (=> black-2-white-2)
    exist_generation_06 = models.BooleanField(null=True, blank=True)  # x-y
    exist_generation_07 = models.BooleanField(null=True, blank=True)  # sun-moon (=> ultra-sun-ultra-moon)
    exist_generation_08 = models.BooleanField(null=True, blank=True)  # sword-shield
    exist_generation_09 = models.BooleanField(null=True, blank=True)  # scarlet-violet

    # 各世代で覚える技の情報を、リスト（JSON形式）として保持
    move_generation_01 = models.JSONField(null=True, blank=True)  # 第1世代の技（例：['tackle', 'growl', ...]）
    move_generation_02 = models.JSONField(null=True, blank=True)  # 第2世代の技
    move_generation_03 = models.JSONField(null=True, blank=True)  # 第3世代の技
    move_generation_04 = models.JSONField(null=True, blank=True)  # 第4世代の技
    move_generation_05 = models.JSONField(null=True, blank=True)  # 第5世代の技
    move_generation_06 = models.JSONField(null=True, blank=True)  # 第6世代の技
    move_generation_07 = models.JSONField(null=True, blank=True)  # 第7世代の技
    move_generation_08 = models.JSONField(null=True, blank=True)  # 第8世代の技
    move_generation_09 = models.JSONField(null=True, blank=True)  # 第9世代の技

    national_dex = models.IntegerField(null=True, blank=True)
    paldea_dex = models.IntegerField(null=True, blank=True)
    kitakami_dex = models.IntegerField(null=True, blank=True)
    blueberry_dex = models.IntegerField(null=True, blank=True)
    
    species_json_file = models.CharField(max_length=255)
    pokemon_json_file = models.CharField(max_length=255)
    form_json_file = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.ja} ({self.unique_id})"
