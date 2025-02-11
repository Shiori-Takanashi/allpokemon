import os
import re

def is_sequential_files(file_list):
    if not file_list:
        return False

    pattern = re.compile(r'^([a-zA-Z]*)(\d+)(\.[^.]+)?$')
    numbers = []
    prefix = None

    for filename in file_list:
        match = pattern.match(filename)
        if not match:
            return False  # 1つでもパターンに合わなければ連番ではない
        current_prefix = match.group(1)
        if prefix is None:
            prefix = current_prefix
        elif prefix != current_prefix:
            return False  # プレフィックスが異なるなら連番と認めません
        num = int(match.group(2))
        numbers.append(num)

    numbers.sort()
    expected = list(range(numbers[0], numbers[0] + len(numbers)))
    return numbers == expected

def generate_directory_structure(output_file="directory_structure.txt"):
    root_dir = os.path.dirname(os.path.abspath(__file__))

    # 除外するディレクトリの正規表現パターン（raw文字列で記述）
    exclude_patterns = [
        re.compile(r'^\.git$'),
        re.compile(r'^node_modules$'),
        re.compile(r'^node$'),
        re.compile(r'^__pycache__$'),
        re.compile(r'^npx-sample$'),
        re.compile(r'^chakra$')
    ]

    def is_excluded(dirname):
        return any(pattern.match(dirname) for pattern in exclude_patterns)

    # 表示用のインデント文字列を構築する関数
    def get_indent(level, is_last=False):
        # is_last が True なら末尾記号を変える（今回は単純化のため固定）
        return "│   " * level + ("├── " if level > 0 else "")

    with open(output_file, "w", encoding="utf-8") as f:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # 除外対象ディレクトリは再帰対象から除外し、ツリー上は「(skipped)」と表示
            original_dirnames = dirnames[:]  # コピーを保持
            dirnames[:] = [d for d in dirnames if not is_excluded(d)]
            skipped_dirs = [d for d in original_dirnames if is_excluded(d)]

            # 現在のディレクトリの階層をカウント
            level = dirpath.replace(root_dir, "").count(os.sep)
            indent = get_indent(level)
            current_dir_name = os.path.basename(dirpath) if os.path.basename(dirpath) else os.path.basename(root_dir)
            f.write(f"{indent}{current_dir_name}/\n")

            # 除外したディレクトリを表示
            sub_indent = get_indent(level + 1)
            for skipped in skipped_dirs:
                f.write(f"{sub_indent}{skipped}/ (skipped)\n")

            # ファイル一覧の処理
            if filenames:
                # まずソートして安定した順番に
                filenames.sort()

                # すべてのファイルが連番ならまとめてスキップ表示
                if is_sequential_files(filenames):
                    f.write(f"{sub_indent}{len(filenames)} sequential files (skipped)\n")
                else:
                    # ファイル数が12個以上の場合は最初の3件だけ表示
                    max_display = 12
                    if len(filenames) >= max_display:
                        display_count = 3
                        files_to_show = filenames[:display_count]
                        for filename in files_to_show:
                            f.write(f"{sub_indent}{filename}\n")
                        skipped_count = len(filenames) - display_count
                        f.write(f"{sub_indent}{skipped_count} more files (skipped)\n")
                    else:
                        for filename in filenames:
                            f.write(f"{sub_indent}{filename}\n")

    print(f"ディレクトリ構成を '{output_file}' に出力しました。すっきり整理されたツリーをお楽しみください！（数字たちもダンスしていますよ！）")

if __name__ == "__main__":
    generate_directory_structure()
