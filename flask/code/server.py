from flask import Flask, render_template, abort, url_for
from markupsafe import escape
from pathlib import Path
import json

app = Flask(__name__)

BASE_DIR = Path(__file__).parent
RESULT_JSON = BASE_DIR / "result.json"

@app.route("/")
def index():
    """
    トップページ: result.json の内容をテーブル表示
    """
    # もし result.json が無ければエラー
    if not RESULT_JSON.exists():
        return "<p>result.json が見つかりませんでした。<br>先に 'python generate_result.py' を実行してください。</p>"

    # result.json 読み込み
    with RESULT_JSON.open("r", encoding="utf-8") as f:
        data = json.load(f)

    # 各行に URL を付加しておく
    for row in data:
        sp_file = row.get("species_json_file")
        if sp_file:
            row["species_url"] = url_for("view_local_json_with_wrap", relpath=sp_file)
        pk_file = row.get("pokemon_json_file")
        if pk_file:
            row["pokemon_url"] = url_for("view_local_json_with_wrap", relpath=pk_file)
        fm_file = row.get("form_json_file")
        if fm_file:
            row["form_url"] = url_for("view_local_json_with_wrap", relpath=fm_file)

    return render_template("index.html", data=data)

@app.route("/files/<path:relpath>")
def view_local_json_with_wrap(relpath):
    """
    JSONファイルの内容を <pre> タグで表示し、折り返しを有効にして返す。
    """
    full_path = (BASE_DIR / "files" / relpath).resolve()
    # セキュリティ上、resolve() などでパスを正規化しておく

    if not full_path.exists():
        abort(404, description=f"File {relpath} not found.")

    try:
        text = full_path.read_text(encoding="utf-8")
        parsed = json.loads(text)
        pretty_text = json.dumps(parsed, indent=2, ensure_ascii=False)
    except Exception as e:
        abort(400, description=f"Failed to load JSON: {e}")

    escaped = escape(pretty_text)
    html_content = f"""
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>JSON View</title>
    <style>
    body {{
        background-color: #2e2e2e;
        color: #ffffff;
        margin: 0; 
        padding: 0; 
        font-family: sans-serif;
    }}
    pre {{
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 1rem;
        padding: 1rem;
        background-color: #1e1e1e;
        border-radius: 4px;
    }}
    </style>
</head>
<body>
    <pre>{escaped}</pre>
</body>
</html>
"""
    return html_content

if __name__ == "__main__":
    # Flask アプリを起動
    # デバッグモード有効の場合
    app.run(debug=True)
