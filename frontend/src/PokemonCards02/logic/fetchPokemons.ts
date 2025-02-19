// logic/fetchPokemons.ts
import axios from "axios";
import { PokemonListResponse } from "../types/types";

export async function fetchPokemons(apiUrl: string): Promise<PokemonListResponse> {
  const response = await axios.get<PokemonListResponse>(apiUrl);
  return response.data;
}
