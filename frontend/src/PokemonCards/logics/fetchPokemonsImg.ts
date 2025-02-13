import axios from "axios";

export interface PokemonImg {
    blob: Blob;
    url: string;
  }

/**
 * 指定のURLから画像を取得し、Blobとして返す非同期関数
 * @param imageUrl 画像のURL
 * @returns 画像のBlobと生成したURLオブジェクト
 */
export const fetchPokemonImg = async (imageUrl: string): Promise<PokemonImg> => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "blob", // 画像データをバイナリとして取得
      });
  
      const blob = response.data as Blob; // 型アサーションを追加
      const url = URL.createObjectURL(blob); // BlobからオブジェクトURLを生成
  
      return { blob, url };
    } catch (error) {
      console.error("画像の取得に失敗しました:", error);
      throw new Error("画像の取得に失敗しました");
    }
  };
  