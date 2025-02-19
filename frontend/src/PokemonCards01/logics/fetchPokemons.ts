// src/components/PokemonCards/logics/fetchPokemons.ts
import axios from "axios";
import { PokemonListResponse } from "../types/types";

/**
 * ページネーション付きのポケモン情報を取得する非同期関数
 */
export async function fetchPokemons(apiUrl: string): Promise<PokemonListResponse> {
  const response = await axios.get<PokemonListResponse>(apiUrl);
  return response.data;
}
