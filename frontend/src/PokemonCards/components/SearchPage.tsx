// src/PokemonCards/components/SearchPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

import { Status, PokemonListResponse } from "@/PokemonCards/types/types";
import { createRequestUrl } from "./createRequestUrl";
import SearchDataDisplay from "./SearchDataDisplay";
import PaginationControls from "./PaginationControls";
import StatusGroup from "./StatusGroup";
import ShowStatuses from "./ShowStatuses";
import { toaster } from "@/components/ui/toaster";

const LIMIT = 48; // 1ページあたりの件数を48に

const SearchPage: React.FC = () => {
  // フィルター配列
  const [statuses, setStatuses] = useState<Status[]>([
    {
      selectedStat: { label: "---", value: "none" },
      selectedOperator: { label: "---", value: "none" },
      value: "",
    },
    {
      selectedStat: { label: "---", value: "none" },
      selectedOperator: { label: "---", value: "none" },
      value: "",
    },
    {
      selectedStat: { label: "---", value: "none" },
      selectedOperator: { label: "---", value: "none" },
      value: "",
    },
    {
      selectedStat: { label: "---", value: "none" },
      selectedOperator: { label: "---", value: "none" },
      value: "",
    },
  ]);

  // ページネーションの offset
  const [offset, setOffset] = useState(0);

  // 取得した検索結果データ
  const [searchData, setSearchData] = useState<PokemonListResponse | null>(null);

  // フィルタ実行時に呼ばれる関数
  const handleFilter = () => {
    // フィルタを変えたら最初のページ(offset=0)に戻す
    setOffset(0);
    fetchData(0);
  };

  // 実際にデータを取得する関数
  const fetchData = async (currentOffset: number) => {
    const effectiveStatuses = statuses.filter((st) => {
      const noneStat = st.selectedStat.value === "none";
      const noneOp = st.selectedOperator.value === "none";
      const emptyVal = !st.value.trim();
      return !(noneStat || noneOp || emptyVal);
    });

    // createRequestUrl でフィルタ＋オフセットをまとめてクエリ化
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

      toaster.create({
        description: `データを取得しました (offset=${currentOffset})`,
        type: "info",
      });
    } catch (error) {
      console.error("fetchData error:", error);
      toaster.create({
        description: `データ取得エラー: ${String(error)}`,
        type: "error",
      });
    }
  };

  // 初回マウント時のみ、全件(offset=0)を取得
  useEffect(() => {
    fetchData(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ページネーションが変化したら再取得
  useEffect(() => {
    fetchData(offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // offset を更新するコールバック（PaginationControls から呼ばれる）
  const onOffsetChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (
    <Box width="100%" maxW="1200px" mx="auto" mt={4}>
      {/* フィルタ入力 */}
      <StatusGroup statuses={statuses} setStatuses={setStatuses} />

      {/* フィルタ実行ボタン (ShowStatuses) */}
      <ShowStatuses statuses={statuses} onFilter={handleFilter} />

      {/* 検索結果 */}
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
