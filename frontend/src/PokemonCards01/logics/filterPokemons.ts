// src/components/PokemonCards/logics/filterPokemons.ts
import { PokemonListResponse, PokemonDetail, SelectOption } from "../types/types";

/**
 * react-select 用のタイプオプション（固定値）
 */
export const typeOptionsReact: SelectOption[] = [
  { value: "Any", label: "Any" },
  { value: "None", label: "None" },
  { value: "普", label: "普" },
  { value: "炎", label: "炎" },
  { value: "水", label: "水" },
  { value: "電", label: "電" },
  { value: "草", label: "草" },
  { value: "氷", label: "氷" },
  { value: "格", label: "格" },
  { value: "毒", label: "毒" },
  { value: "地", label: "地" },
  { value: "飛", label: "飛" },
  { value: "超", label: "超" },
  { value: "虫", label: "虫" },
  { value: "岩", label: "岩" },
  { value: "霊", label: "霊" },
  { value: "竜", label: "竜" },
  { value: "悪", label: "悪" },
  { value: "鋼", label: "鋼" },
  { value: "妖", label: "妖" },
];

/**
 * 選択された2種類のタイプに基づき、PokemonListResponse.results をフィルタリングする関数
 * @param response サーバーから取得した PokemonListResponse
 * @param selectedType1 react-select のオプション
 * @param selectedType2 react-select のオプション
 * @returns フィルタされた PokemonDetail[] 配列
 */
export function applyTypeFilter(
  response: PokemonListResponse,
  selectedType1: SelectOption,
  selectedType2: SelectOption
): PokemonDetail[] {
  const { results } = response;

  const isNone = (type: string) => type === "None";
  const isAny = (type: string) => type === "Any";
  const isRealType = (type: string) => !isNone(type) && !isAny(type);

  const t1 = selectedType1.value;
  const t2 = selectedType2.value;

  // (1) 両方が "None" の場合は 0 件を返す
  if (isNone(t1) && isNone(t2)) {
    return [];
  }

  // (2) "None" と "Any" の組み合わせの場合 => 単一タイプ（type_ の長さが 1）のポケモンを抽出
  if ((isNone(t1) && isAny(t2)) || (isAny(t1) && isNone(t2))) {
    return results.filter((p) => p.type_.length === 1);
  }

  // (3) 両方が "Any" の場合 => 複合タイプ（type_ の長さが 2 以上）のポケモンを抽出
  if (isAny(t1) && isAny(t2)) {
    return results.filter((p) => p.type_.length > 1);
  }

  // (4) 両方同じ実タイプの場合は 0 件
  if (t1 === t2 && isRealType(t1)) {
    return [];
  }

  // (5) 指定された実タイプに基づきフィルタする
  let filtered: PokemonDetail[] = results;
  if (isRealType(t1)) {
    filtered = filtered.filter((p) => p.type_.includes(t1));
  }
  if (isRealType(t2)) {
    filtered = filtered.filter((p) => p.type_.includes(t2));
  }
  return filtered;
}
