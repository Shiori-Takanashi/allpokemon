import axios from "axios";

export interface PokemonImg {
  blob: Blob;
  url: string;
}

/**
 * 指定の URL から画像を取得し、Blob と生成したオブジェクト URL を返す非同期関数。
 * API の変更により、画像 URL が null や空の場合はエラーをスローするようにしています。
 *
 * @param imageUrl 画像の URL
 * @returns 画像の Blob と生成したオブジェクト URL
 * @throws 画像 URL が指定されていない場合、または画像の取得に失敗した場合
 */
export const fetchPokemonImg = async (imageUrl: string): Promise<PokemonImg> => {
  // 画像 URL が falsy の場合は早期にエラーをスロー
  if (!imageUrl) {
    throw new Error("画像 URL が指定されていません");
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "blob", // 画像データをバイナリとして取得
    });

    const blob = response.data as Blob;
    const url = URL.createObjectURL(blob); // Blob からオブジェクト URL を生成

    return { blob, url };
  } catch (error) {
    console.error("画像の取得に失敗しました:", error);
    throw new Error("画像の取得に失敗しました");
  }
};
