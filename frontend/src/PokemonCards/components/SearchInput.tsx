// src/components/PokemonCards/ui/SearchInput.tsx
import React from "react";
import { usePokemonCardsContext } from "../context/PokemonCardsContext";

const SearchInput: React.FC = () => {
  const { searchTerm, setSearchTerm, handleKeyDown } = usePokemonCardsContext();

  return (
    <div className="input-container">
      <input
        className="input-search"
        placeholder="ポケモン名を入力"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchInput;
