"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

import { Status, PokemonListResponse } from "@/PokemonCards/types/types";
import { createRequestUrl } from "./createRequestUrl";
import SearchDataDisplay from "./SearchDataDisplay";
import PaginationControls from "./PaginationControls";
import StatusGroup from "./StatusGroup";
import ShowStatuses from "./ShowStatuses";

// 共通のトースト関数をインポート
import {
  showToastSuccess,
  showToastError,
  showToastWarning,
} from "@/components/ui/toaster";

const LIMIT = 48; // 1ページあたりの件数

const SearchPage: React.FC = () => {
  const initialStatus = {
    selectedStat: { label: "---", value: "none" },
    selectedOperator: { label: "---", value: "none" },
    value: "",
  };

  const [statuses, setStatuses] = useState<Status[]>(
    Array.from({ length: 4 }, () => initialStatus)
  );

  const [offset, setOffset] = useState<number>(0);
  const [searchData, setSearchData] = useState<PokemonListResponse | null>(null);

  /**
   * 重複するステータスがないかチェックする関数
   * 重複があればトーストを表示して false を返す
   */
  const validateStatuses = useCallback((): boolean => {
    const statusCount: Record<string, number> = {};
    for (const st of statuses) {
      const key = st.selectedStat.value;
      if (key !== "none" && key !== "") {
        statusCount[key] = (statusCount[key] || 0) + 1;
        if (statusCount[key] > 1) {
          showToastWarning({
            description:
              "同じステータスに複数の条件があります。\nフィルターを実行しません。",
          });
          return false;
        }
      }
    }
    return true;
  }, [statuses]);

  /**
   * 有効なフィルター条件を抽出する関数
   */
  const getEffectiveStatuses = useCallback((): Status[] => {
    return statuses.filter((st) => {
      const isNoneStat = st.selectedStat.value === "none";
      const isNoneOp = st.selectedOperator.value === "none";
      const isEmptyValue = !st.value.trim();
      return !(isNoneStat || isNoneOp || isEmptyValue);
    });
  }, [statuses]);

  /**
   * API からデータを取得する関数
   * @param currentOffset ページネーション用のオフセット
   * @param showToastOnSuccess 成功時にトーストを表示するか
   */
  const fetchData = useCallback(
    async (currentOffset: number, showToastOnSuccess = false) => {
      const effectiveStatuses = getEffectiveStatuses();
      const url = createRequestUrl(
        "http://localhost:8000/api/national-pokemon/",
        effectiveStatuses,
        currentOffset,
        LIMIT
      );
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`サーバーエラー: ${res.status}`);
        }
        const data: PokemonListResponse = await res.json();
        setSearchData(data);

        if (showToastOnSuccess) {
          showToastSuccess({ description: "データ取得に成功" });
        }
      } catch (error) {
        console.error("fetchData error:", error);
        showToastError({
          description: `データ取得に失敗: ${String(error)}`,
        });
      }
    },
    [getEffectiveStatuses]
  );

  /**
   * フィルター実行ハンドラ
   *  - 重複チェック → ページリセット → データ取得
   */
  const handleFilter = useCallback(() => {
    if (!validateStatuses()) return;
    setOffset(0);
    fetchData(0, true);
  }, [validateStatuses, fetchData]);

  // 初回マウント時に全件取得
  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  // offset 変更時にデータ取得（ページネーション用）
  useEffect(() => {
    fetchData(offset, false);
  }, [offset, fetchData]);

  // PaginationControls から呼ばれるオフセット更新用コールバック
  const onOffsetChange = useCallback((newOffset: number) => {
    setOffset(newOffset);
  }, []);

  return (
    <Box width="100%" p="9">
      <ShowStatuses statuses={statuses} onFilter={handleFilter} />
      <StatusGroup statuses={statuses} setStatuses={setStatuses} />
      {searchData ? (
        <>
          <SearchDataDisplay data={searchData} />
          <PaginationControls
            totalCount={searchData.count}
            limit={LIMIT}
            offset={offset}
            onOffsetChange={onOffsetChange}
          />
        </>
      ) : (
        <Text mt={4}>データがありません</Text>
      )}
    </Box>
  );
};

export default SearchPage;
