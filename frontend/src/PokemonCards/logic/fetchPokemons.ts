// src/PokemonCards/logic/fetchPokemons.ts
import { PokemonListResponse } from "../types/types";

/**
 * シンプルに fetch でデータを取得して JSON を返す関数
 */
export async function fetchPokemons(apiUrl: string): Promise<PokemonListResponse> {
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`サーバーエラー: ${res.status}`);
  }
  const data: PokemonListResponse = await res.json();
  return data;
}
