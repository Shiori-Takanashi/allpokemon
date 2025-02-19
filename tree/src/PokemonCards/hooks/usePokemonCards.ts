// src/components/PokemonCardsContent/hooks/usePokemonCards.ts

import { usePokemonFetch } from "./usePokemonFetch";
import { usePokemonFilter } from "./usePokemonFilter";
import { usePagination } from "./usePagination";
import { useModals } from "./useModals";
import { usePokemonUI } from "./usePokemonUI";

/**
 * 「ポケモンカード」を扱う全ロジックを統合したカスタムフック
 */
export function usePokemonCards() {
  // 1. データ取得
  const {
    apiUrl,
    setApiUrl,
    endpoints,
    pokemonData,
    loading,
    regionName,
  } = usePokemonFetch();

  // 2. フィルタ処理
  const {
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
  } = usePokemonFilter(pokemonData);

  // 3. ページネーション
  const itemsPerPage = 48; // 1ページあたりの件数
  const {
    currentPage,
    setCurrentPage,
    showAll,
    setShowAll,
    isLoadingAll,
    toggleShowAll,
    displayedData,
    totalPages,
  } = usePagination(filteredData, itemsPerPage);

  // 4. モーダル
  const {
    isEndpointModalOpen,
    setIsEndpointModalOpen,
    isExplanationOpen,
    setIsExplanationOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isLinksModalOpen,
    setIsLinksModalOpen,
  } = useModals();

  // 5. UI 表示切り替え
  const { showActualStats, setShowActualStats } = usePokemonUI();

  // ------------------------
  // スピナー表示の管理
  // ------------------------
  const isSpinner = loading || isLoadingAll || isSearching;

  // ------------------------
  // すべての状態をリセットする関数
  // ------------------------
  const resetAllStates = () => {
    // フィルタのリセット
    resetFilter();
    // ページを最初に戻す
    setCurrentPage(1);
    // 全表示フラグオフ
    setShowAll(false);
  };

  // エクスポートする値をまとめる
  return {
    // ----- state系 -----
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
    isSearchModalOpen,
    isLinksModalOpen,
    isSpinner,
    regionName,
    totalPages,
    displayedData,

    // ----- setter -----
    setApiUrl,
    setSearchTerm,
    setSelectedType1,
    setSelectedType2,
    setCurrentPage,
    setShowActualStats,
    setIsEndpointModalOpen,
    setIsExplanationOpen,
    setIsSearchModalOpen,
    setIsLinksModalOpen,

    // ----- actions -----
    handleSearch,
    handleKeyDown,
    toggleShowAll,
    resetAllStates,
  };
}
