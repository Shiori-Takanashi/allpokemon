// src/PokemonCards/components/createRequestUrl.ts
import { Status } from "@/PokemonCards/types/types";

/**
 * ステータス情報と offset / limit を基にリクエストURLを作成
 */
export function createRequestUrl(
  baseUrl: string,
  statuses: Status[],
  offset: number,
  limit: number
): string {
  const params = new URLSearchParams();
  params.set("offset", offset.toString());
  params.set("limit", limit.toString());

  // statuses から "none" や空文字は無効扱いにするロジックは呼び出し元でフィルタ済みでもOK
  statuses.forEach((st) => {
    if (!st.value.trim()) return;

    const statKey = st.selectedStat.value.replace(/Line$/, "").toLowerCase(); 
    params.set(`${statKey}_op`, st.selectedOperator.value);
    params.set(`${statKey}_line`, st.value);
  });

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
