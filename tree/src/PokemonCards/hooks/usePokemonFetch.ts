// src/components/PokemonCardsContent/hooks/usePokemonFetch.ts

import { useState, useEffect } from "react";
// fetchPokemons: 指定された URL からポケモンデータを取得する非同期関数
// Pokemon: ポケモンデータの型
import { fetchPokemons, Pokemon } from "../logics/fetchPokemons";

/**
 * エンドポイント一覧で使う型
 * -----------------------------------------------
 * - `label`: UI で表示するエンドポイント名
 * - `url`: API のエンドポイント URL
 * -----------------------------------------------
 */
export interface Endpoint {
  label: string;
  url: string;
}

/**
 * ポケモンデータを指定した API から取得し、状態管理するカスタムフック
 * ------------------------------------------------------
 * - 初回レンダリング時に `initialUrl` からデータを取得
 * - ユーザーがエンドポイントを変更すると `apiUrl` が更新され再取得
 * - `loading` ステータスを管理し、データ取得中はローディング表示を可能に
 * ------------------------------------------------------
 * @param initialUrl 初回取得時の API の URL（デフォルトは全国版）
 */
export function usePokemonFetch(
  initialUrl: string = "http://localhost:8000/api/national-pokemon/"
) {
  // 現在の API URL を管理
  const [apiUrl, setApiUrl] = useState(initialUrl);

  // 取得したポケモンデータを管理
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

  // データ取得中かどうかを示す状態
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * 取得可能な API のエンドポイント一覧
   * --------------------------------------------------
   * - 全国版（全ポケモンを取得）
   * - ガラル版（ソード・シールドに登場するポケモンのみ）
   * - パルデア版（スカーレット・バイオレットに登場するポケモンのみ）
   * --------------------------------------------------
   */
  const endpoints: Endpoint[] = [
    { label: "全国版", url: "http://localhost:8000/api/national-pokemon/" },
    { label: "ガラル版", url: "http://localhost:8000/api/galar-pokemon/" },
    { label: "パルデア版", url: "http://localhost:8000/api/paldea-pokemon/" },
  ];

  /**
   * ポケモンデータを API から非同期取得
   * -----------------------------------------------
   * - `apiUrl` の変更に応じて実行
   * - `fetchPokemons(apiUrl)` を実行しデータを取得
   * - 成功時: `pokemonData` を更新
   * - 失敗時: `console.error` でエラーログを出力
   * - `loading` を適切に制御
   * -----------------------------------------------
   */
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

  /**
   * 指定した API URL から対応する地方名を取得
   * -----------------------------------------------
   * - "national-pokemon" を含む → "全国版"
   * - "galar-pokemon" を含む → "ガラル版"
   * - "paldea-pokemon" を含む → "パルデア版"
   * - それ以外 → 空文字
   * -----------------------------------------------
   * @param url 検査する API URL
   * @returns 対応する地方名
   */
  const getRegionName = (url: string): string => {
    if (url.includes("national-pokemon")) return "全国版";
    if (url.includes("galar-pokemon")) return "ガラル版";
    if (url.includes("paldea-pokemon")) return "パルデア版";
    return "";
  };

  // 現在の API URL に対応する地方名
  const regionName = getRegionName(apiUrl);

  return {
    apiUrl, // 現在の API URL
    setApiUrl, // API URL の更新関数
    endpoints, // 取得可能なエンドポイント一覧
    pokemonData, // 取得したポケモンデータ
    loading, // データ取得中かどうか
    regionName, // 現在の API に対応する地方名
  };
}
