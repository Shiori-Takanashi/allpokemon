// src/components/PokemonCards/logics/filterPokemons.ts
import { Pokemon } from "./fetchPokemons";

/** react-select 用に使用するオプションの型 */
export interface SelectOption {
  value: string;
  label: string;
}

/** タイプ一覧 → react-select オプションへ変換 */
const typeOptions: string[] = [
  "Any",
  "None",
  "普",
  "炎",
  "水",
  "電",
  "草",
  "氷",
  "格",
  "毒",
  "地",
  "飛",
  "超",
  "虫",
  "岩",
  "霊",
  "竜",
  "悪",
  "鋼",
  "妖",
];
export const typeOptionsReact: SelectOption[] = typeOptions.map((t) => ({
  value: t,
  label: t,
}));

/**
 * 選択された2種類のタイプに基づき、ポケモン配列をフィルタリングする関数
 */
export function applyTypeFilter(
  data: Pokemon[],
  selectedType1: SelectOption,
  selectedType2: SelectOption
): Pokemon[] {
  const t1 = selectedType1.value;
  const t2 = selectedType2.value;

  // (1) None & None => 0件
  if (t1 === "None" && t2 === "None") {
    return [];
  }
  // (2) None & Any or Any & None => 単タイプ (TYPE02が無い)
  if ((t1 === "None" && t2 === "Any") || (t1 === "Any" && t2 === "None")) {
    return data.filter((p) => !p.TYPE02);
  }
  // (3) Any & Any => 複合タイプ(TYP2が存在)
  if (t1 === "Any" && t2 === "Any") {
    return data.filter((p) => p.TYPE02);
  }
  // (4) 両方同じタイプ(Any/None以外) => 0件
  if (t1 === t2 && t1 !== "Any" && t1 !== "None") {
    return [];
  }
  // (5) 実際のタイプ指定
  let filtered = data;
  if (t1 !== "Any" && t1 !== "None") {
    filtered = filtered.filter((p) => p.TYPE01 === t1 || p.TYPE02 === t1);
  }
  if (t2 !== "Any" && t2 !== "None") {
    filtered = filtered.filter((p) => p.TYPE01 === t2 || p.TYPE02 === t2);
  }
  return filtered;
}
