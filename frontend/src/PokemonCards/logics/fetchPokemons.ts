// src/components/PokemonCards/logics/fetchPokemons.ts
import axios from "axios";

/** ポケモン情報の型定義 */
export interface Pokemon {
  unique_id: string;
  name: string;
  base_h: number;
  base_a: number;
  base_b: number;
  base_c: number;
  base_d: number;
  base_s: number;
  TYPE01: string;
  TYPE02?: string;
}

/**
 * 指定のエンドポイント（apiUrl）からポケモン情報を取得する非同期関数
 */
export async function fetchPokemons(apiUrl: string): Promise<Pokemon[]> {
  const response = await axios.get<Pokemon[]>(apiUrl);
  return response.data;
}
