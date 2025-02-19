// src/PokemonCards/hooks/usePokemonImgFetch.ts
import { useState, useEffect } from "react";
import { fetchPokemonImg, PokemonImg } from "../logics/fetchPokemonsImg";

interface UsePokemonImgFetchResult {
  pokemonImg: PokemonImg | null;
  loading: boolean;
  error: string | null;
}

/**
 * 指定された imageUrl から画像を取得し、状態として返すカスタムフック
 * @param imageUrl 画像の URL
 * @returns { pokemonImg, loading, error } 画像の状態、読み込み中フラグ、エラー情報
 */
const usePokemonImgFetch = (imageUrl: string): UsePokemonImgFetchResult => {
  const [pokemonImg, setPokemonImg] = useState<PokemonImg | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // imageUrl が空の場合は何もしない
    if (!imageUrl) {
      return;
    }

    let isMounted = true; // コンポーネントのマウント状態を管理
    setLoading(true);
    setError(null);

    // 画像を取得
    fetchPokemonImg(imageUrl)
      .then((data) => {
        if (isMounted) {
          setPokemonImg(data);
        }
      })
      .catch((err) => {
        console.error("画像の取得に失敗しました:", err);
        if (isMounted) {
          setError("画像の取得に失敗しました");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    // クリーンアップ処理:
    // 1. コンポーネントのアンマウント時に状態更新を防止するため isMounted を false に設定
    // 2. すでに生成されたオブジェクトURLがあれば解放してメモリリークを防ぐ
    return () => {
      isMounted = false;
      if (pokemonImg?.url) {
        URL.revokeObjectURL(pokemonImg.url);
      }
    };
  }, [imageUrl]); // imageUrl が変更されたら再取得

  return { pokemonImg, loading, error };
};

export default usePokemonImgFetch;