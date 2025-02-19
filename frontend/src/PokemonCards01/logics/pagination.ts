// src/components/PokemonCards/logics/pagination.ts
import { PokemonDetail } from "../types/types";

/**
 * 指定されたページ・1ページあたりの件数に基づき、配列を切り出す関数
 */
export function paginate(
  data: PokemonDetail[],
  currentPage: number,
  itemsPerPage: number
): PokemonDetail[] {
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  return data.slice(indexOfFirst, indexOfLast);
}

/**
 * トータルページ数を返す関数
 */
export function getTotalPages(dataLength: number, itemsPerPage: number): number {
  return Math.ceil(dataLength / itemsPerPage);
}
