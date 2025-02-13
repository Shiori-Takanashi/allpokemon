// src/components/PokemonCardsContent/hooks/usePokemonFetch.ts

import { useState, useEffect } from "react";
import { fetchPokemons, Pokemon } from "@/PokemonCards/logics/fetchPokemons";

// エンドポイント一覧で使う型
export interface Endpoint {
  label: string;
  url: string;
}

/**
 * ポケモンデータを指定した API から取得し、状態管理するフック
 * @param initialUrl API の初期URL
 */
export function usePokemonFetch(
  initialUrl: string = "http://localhost:8000/api/national-pokemon/"
) {
  const [apiUrl, setApiUrl] = useState(initialUrl);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 取得するAPI候補
  const endpoints: Endpoint[] = [
    { label: "全国版", url: "http://localhost:8000/api/national-pokemon/" },
    { label: "ガラル版", url: "http://localhost:8000/api/galar-pokemon/" },
    { label: "パルデア版", url: "http://localhost:8000/api/paldea-pokemon/" },
  ];

  useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      try {
        const data = await fetchPokemons(apiUrl);
        setPokemonData(data);
      } catch (error) {
        console.error("fetchPokemons error:", error);
      }
      setLoading(false);
    };
    doFetch();
  }, [apiUrl]);

  // 地方名を取得
  const getRegionName = (url: string): string => {
    if (url.includes("national-pokemon")) return "全国版";
    if (url.includes("galar-pokemon")) return "ガラル版";
    if (url.includes("paldea-pokemon")) return "パルデア版";
    return "";
  };
  const regionName = getRegionName(apiUrl);

  return {
    apiUrl,
    setApiUrl,
    endpoints,
    pokemonData,
    loading,
    regionName,
  };
}
