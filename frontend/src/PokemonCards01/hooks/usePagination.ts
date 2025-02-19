// src/components/PokemonCardsContent/hooks/usePagination.ts

import { useState } from "react";
import { PokemonDetail } from "../types/types";
import { paginate, getTotalPages } from "@/PokemonCards01/logics/pagination";

/**
 * ページネーションに必要な状態やロジックを管理するフック
 * @param filteredData フィルタ後のデータ
 * @param itemsPerPage 1ページあたりに表示する件数
 */
export function usePagination(filteredData: PokemonDetail[], itemsPerPage: number) {
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 「すべて表示」フラグ
  const [showAll, setShowAll] = useState<boolean>(false);

  // 「すべて表示」に切り替えるときのローディング制御
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(false);

  /**
   * 「すべて表示」をトグルする
   */
  const toggleShowAll = () => {
    setIsLoadingAll(true);
    setTimeout(() => {
      setShowAll((prev) => !prev);
      setIsLoadingAll(false);
    }, 300);
  };

  // 総ページ数
  const totalPages = getTotalPages(filteredData.length, itemsPerPage);

  // 実際に現在のページや「すべて表示」フラグを反映したデータ
  const displayedData = showAll
    ? filteredData
    : paginate(filteredData, currentPage, itemsPerPage);

  return {
    currentPage,
    setCurrentPage,
    showAll,
    setShowAll,
    isLoadingAll,
    toggleShowAll,
    displayedData,
    totalPages,
  };
}
