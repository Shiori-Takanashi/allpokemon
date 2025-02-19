// components/createRequestUrl.ts
import { Status } from "../types/types";

/**
 * ステータス情報とオフセット・リミット情報を基にリクエストURLを作成する関数
 * @param baseUrl APIのエンドポイントURL（例: "https://example.com/api/pokemons"）
 * @param statuses フィルター対象のステータス情報の配列
 * @param offset ページネーション用のオフセット値（任意）
 * @param limit ページネーション用のリミット値（任意）
 * @returns クエリパラメータ付きのリクエストURL
 */
export function createRequestUrl(
  baseUrl: string,
  statuses: Status[],
  offset?: number,
  limit?: number
): string {
  const params = new URLSearchParams();

  if (offset !== undefined) {
    params.set("offset", offset.toString());
  }
  if (limit !== undefined) {
    params.set("limit", limit.toString());
  }

  statuses.forEach(status => {
    if (!status.value.trim()) return;

    // selectedStat.value から "Line" を除去し小文字に変換（例："hLine" → "h"）
    const statKey = status.selectedStat.value.replace(/Line$/i, '').toLowerCase();

    params.set(`${statKey}_op`, status.selectedOperator.value);
    params.set(`${statKey}_line`, status.value);
  });

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
