// src/components/PokemonCards/ui/SearchInput.tsx
import React from "react";
import { usePokemonCardsContext } from "@/PokemonCards/context/Context";

const SearchInput: React.FC = () => {
  const { searchTerm, setSearchTerm, handleSearch } = usePokemonCardsContext();

  return (
    <div style={styles.container}>
      {/* 入力フィールド */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Enterキーで検索
        placeholder="ポケモン名を入力"
        style={styles.input}
      />
    </div>
  );
};

// スタイルをオブジェクトで管理
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: "8px",
    borderRadius: "4px",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    flex: 1,
    padding: "6px 12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
  resetButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    marginLeft: "8px",
  },
};

export default SearchInput;
