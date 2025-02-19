// src/components/PokemonCardsContent/hooks/usePokemonFilter.ts

import { useState, useEffect } from "react";
import { applyTypeFilter } from "@/PokemonCards01/logics/filterPokemons";
import { PokemonDetail } from "../types/types";
import { SelectOption } from "../types/types";

/**
 * ポケモンリストをもとに検索やタイプ絞り込みを行うカスタムフック
 * @param pokemonData APIから取得した全ポケモンリスト
 */
export function usePokemonFilter(pokemonData: PokemonDetail[]) {
  // 検索用キーワード
  const [searchTerm, setSearchTerm] = useState<string>("");

  // タイプフィルタ用 (react-select)
  const [selectedType1, setSelectedType1] = useState<SelectOption>({
    value: "Any",
    label: "Any",
  });
  const [selectedType2, setSelectedType2] = useState<SelectOption>({
    value: "Any",
    label: "Any",
  });

  // フィルタ後のポケモンリスト
  const [filteredData, setFilteredData] = useState<PokemonDetail[]>(pokemonData);

  // 検索中かどうか
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // pokemonData が変わるたびに初期化
  useEffect(() => {
    setFilteredData(pokemonData);
  }, [pokemonData]);

  /**
   * 実際に検索キーワードやタイプを適用してフィルタする関数
   */
  const filterPokemons = (): PokemonDetail[] => {
    let temp = [...pokemonData];

    // 名前検索 (部分一致)
    // 変更点: p.name ではなく、p.names.en を利用する
    if (searchTerm.trim() !== "") {
      temp = temp.filter((p) =>
        p.names.ja.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // タイプフィルタ (applyTypeFilter は API の新形式に合わせて実装済み)
    temp = applyTypeFilter({ count: 0, next: null, previous: null, results: temp }, selectedType1, selectedType2);
    return temp;
  };

  /**
   * 検索処理を実行
   */
  const handleSearch = () => {
    setIsSearching(true);
    // 演出用に setTimeout を使用
    setTimeout(() => {
      const result = filterPokemons();
      setFilteredData(result);
      setIsSearching(false);
    }, 300);
  };

  /**
   * Enterキー押下でも検索できるようにする
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * 検索とタイプ指定をリセットして全件表示に戻す
   */
  const resetFilter = () => {
    setSearchTerm("");
    setSelectedType1({ value: "Any", label: "Any" });
    setSelectedType2({ value: "Any", label: "Any" });
    setFilteredData(pokemonData);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedType1,
    setSelectedType1,
    selectedType2,
    setSelectedType2,
    filteredData,
    isSearching,
    handleSearch,
    handleKeyDown,
    resetFilter,
  };
}
