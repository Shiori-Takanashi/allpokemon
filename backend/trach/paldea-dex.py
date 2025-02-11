import requests
import json

# PokeAPI からパルデア地方のポケモンデータを取得
url = "https://pokeapi.co/api/v2/pokedex/31/"
response = requests.get(url)

if response.status_code == 200:
    try:
        data = response.json()

        # JSON ファイルに保存
        with open("paldea-all-pokemon.json", "w", encoding="utf-8") as jf:
            json.dump(data, jf, ensure_ascii=False, indent=2)

        # 図鑑に登録されているポケモン名を取得
        pokemon_list = [entry["pokemon_species"]["name"] for entry in data["pokemon_entries"]]

        # テキストファイルに保存
        if pokemon_list:
            with open("paldea-all-pokemon.txt", "w", encoding="utf-8") as f:
                for pokemon in pokemon_list:
                    f.write(pokemon + "\n")

        print("データの取得と保存が完了しました。")

    except Exception as e:
        print(f"データの処理中にエラーが発生しました: {e}")
else:
    print("データを取得できませんでした。")
