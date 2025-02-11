// src/components/PokemonCards/parts/SearchModal.tsx

import React from "react";

// 既存のSearchInput, TypeSelectを正しくインポート
import SearchInput from "@/PokemonCards/components/SearchInputer";
import TypeSelect from "@/PokemonCards/components/TypeSelecter";

// コンテキストを使う場合
import { usePokemonCardsContext } from "@/PokemonCards/context/Context";

/** propsの型定義 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 検索モーダル
 * - 既存のSearchInputやTypeSelectを内包し、同じContextの検索処理を利用
 */
const SearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { handleSearch } = usePokemonCardsContext();

  // isOpenがfalseなら描画しない
  if (!isOpen) return null;

  // ボタンクリックなどで検索実行→モーダルを閉じる例
  const handleSearchClick = () => {
    handleSearch();
    onClose();
  };

  return (
        <div
        style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
        }}
        >
        <div
            style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            maxWidth: "100%",
            position: "relative",
            }}
        >
        <button
            onClick={onClose}
            style={{
            position: "absolute",
            top: "0px",
            right: "20px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "32px",
            }}
        >
          &times;
        </button>

        {/* 既存の検索フォーム＆タイプ選択をモーダル内に表示 */}
        <div style={{ marginTop: "40px" }}>
          <SearchInput />
        </div>
        <div style={{ marginTop: "20px" }}>
          <TypeSelect onSearchClick={handleSearchClick} />
        </div>

        {/* 例: 下部に検索ボタンを配置し、handleSearch実行＆モーダルを閉じる */}
        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button
            onClick={handleSearchClick}
            style={{
              padding: "6px 12px",
              backgroundColor: "blue",
              color: "#fff",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            検索
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
