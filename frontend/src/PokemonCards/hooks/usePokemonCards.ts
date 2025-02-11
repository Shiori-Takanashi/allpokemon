// src/components/PokemonCardsContent/hooks/usePokemonCards.ts
import { useState, useEffect } from "react";
import { fetchPokemons, Pokemon } from "@/PokemonCards/logics/fetchPokemons";
import {
  applyTypeFilter,
  SelectOption,
} from "@/PokemonCards/logics/filterPokemons";
import { paginate, getTotalPages } from "@/PokemonCards/logics/pagination";

// エンドポイントの型
export interface Endpoint {
  label: string;
  url: string;
}

/**
 * カスタムフック：ロジックを集約
 */
export function usePokemonCards() {
  // =======================
  //  state
  // =======================
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api/paldea-pokemon/");
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [filteredData, setFilteredData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");

  // タイプ選択 (react-select)
  const [selectedType1, setSelectedType1] = useState<SelectOption>({
    value: "Any",
    label: "Any",
  });
  const [selectedType2, setSelectedType2] = useState<SelectOption>({
    value: "Any",
    label: "Any",
  });

  // ページネーション
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(30);
  const [showAll, setShowAll] = useState<boolean>(false);

  // 実数値表示
  const [showActualStats, setShowActualStats] = useState<boolean>(false);

  // モーダル制御
  const [isEndpointModalOpen, setIsEndpointModalOpen] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  // エンドポイント一覧
  const endpoints: Endpoint[] = [
    { label: "全国版", url: "http://localhost:8000/api/national-pokemon/" },
    { label: "ガラル版", url: "http://localhost:8000/api/galar-pokemon/" },
    { label: "パルデア版", url: "http://localhost:8000/api/paldea-pokemon/" },
  ];

  // =======================
  //  Data fetch
  // =======================
  useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      try {
        const data = await fetchPokemons(apiUrl);
        setPokemonData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("fetchPokemons error:", error);
      }
      setLoading(false);
    };
    doFetch();
  }, [apiUrl]);

  // =======================
  //  フィルタ処理
  // =======================
  const filterPokemons = (): Pokemon[] => {
    let temp = [...pokemonData];

    if (searchTerm.trim() !== "") {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // タイプフィルタ
    temp = applyTypeFilter(temp, selectedType1, selectedType2);
    return temp;
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const result = filterPokemons();
      setFilteredData(result);
      setCurrentPage(1);
      setIsSearching(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // =======================
  //  すべて表示トグル
  // =======================
  const toggleShowAll = () => {
    setIsLoadingAll(true);
    setTimeout(() => {
      setShowAll(!showAll);
      setIsLoadingAll(false);
    }, 300);
  };

  // =======================
  // ページネーション
  // =======================
  const totalPages = getTotalPages(filteredData.length, itemsPerPage);
  const displayedData = showAll
    ? filteredData
    : paginate(filteredData, currentPage, itemsPerPage);

  // =======================
  // スピナー状態
  // =======================
  const isSpinner = loading || isLoadingAll || isSearching;

  // =======================
  // 地方名
  // =======================
  function getRegionName(url: string) {
    if (url.includes("national-pokemon")) return "全国版";
    if (url.includes("galar-pokemon")) return "ガラル版";
    if (url.includes("paldea-pokemon")) return "パルデア版";
    return "";
  }
  const regionName = getRegionName(apiUrl);

  return {
    // state
    apiUrl,
    endpoints,
    pokemonData,
    filteredData,
    loading,
    isLoadingAll,
    isSearching,
    searchTerm,
    selectedType1,
    selectedType2,
    currentPage,
    itemsPerPage,
    showAll,
    showActualStats,
    isEndpointModalOpen,
    isExplanationOpen,
    isSpinner,
    regionName,
    totalPages,
    displayedData,

    // setter
    setApiUrl,
    setSearchTerm,
    setSelectedType1,
    setSelectedType2,
    setCurrentPage,
    setShowActualStats,
    setIsEndpointModalOpen,
    setIsExplanationOpen,

    // actions
    handleSearch,
    handleKeyDown,
    toggleShowAll,
  };
}
