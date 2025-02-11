import requests
import json
from pathlib import Path
import time

id = 1
output_dir = Path.cwd() / "data" / "test"

id = 1
MAX_ID = 40  # API にあるポケモン図鑑の最大 ID
retry_count = 3  # 3回までリトライ

while id <= MAX_ID:
    url = f"https://pokeapi.co/api/v2/pokedex/{id}/"

    # APIリクエスト
    for _ in range(retry_count):
        res = requests.get(url)
        if res.status_code == 200:
            break
        print(f"Failed to fetch {url}, retrying...")
        time.sleep(2)  # 2秒待機してリトライ
    else:
        print(f"Skipping ID {id} due to repeated failures")
        id += 1
        continue  # 次の ID に進む

    # JSON取得
    data = res.json()
    output_file = output_dir / f"Number_{id.zfill(2)}.json"

    # JSONファイルとして保存
    with open(output_file, "w", encoding="utf-8") as jf:
        json.dump(data, jf, indent=2, ensure_ascii=False)

    print(f"Saved: {output_file}")
    
    id += 1