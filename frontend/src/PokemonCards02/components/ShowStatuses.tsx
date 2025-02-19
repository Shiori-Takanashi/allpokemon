// components/ShowStatuses.tsx
"use client";
import React from "react";
import { Box } from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";
import { createRequestUrl } from "./createRequestUrl";
import {
  ShowStatusesProps,
  PokemonListResponse,
  Status
} from "../types/types";

interface ExtendedShowStatusesProps extends ShowStatusesProps {
  setSearchData: (data: PokemonListResponse | null) => void;
}

const ShowStatuses: React.FC<ExtendedShowStatusesProps> = ({
  statuses,
  setSearchData,
}) => {
  /**
   * フィルターアイコン押下時のメイン処理
   */
  const handleFilterClick = async () => {
    // 1. "none" になっている(=実質的に条件なし)のスロットは無視する
    const effectiveStatuses = statuses.filter((st) => {
      const isNoneStat = st.selectedStat.value === "none";
      const isNoneOp   = st.selectedOperator.value === "none";
      const isEmptyVal = !st.value.trim();
      // いずれかが「なし」なら実質フィルター無効とみなす
      return !(isNoneStat || isNoneOp || isEmptyVal);
    });

    // 2. 同じステータスに対して複数条件が存在するかをチェック
    //    例: HP>=0 と HP>=100 は競合する→警告を出して処理中断
    const statMap: Record<string, Status[]> = {};
    for (const st of effectiveStatuses) {
      const statKey = st.selectedStat.value; // 例: "hLine", "aLine", ...
      if (!statMap[statKey]) {
        statMap[statKey] = [];
      }
      statMap[statKey].push(st);
    }

    // もし同じステータスに複数条件があれば競合チェック（例として一律NGにする）
    for (const key in statMap) {
      if (statMap[key].length > 1) {
        alert(`「${key}」に複数の条件があります。片方が無視される可能性があるため、フィルタを実行しません。`);
        return;
      }
    }

    // 3. 有効な条件が一つもなければ、全件取得などの処理に変えたい場合はここで分岐
    if (effectiveStatuses.length === 0) {
      alert("有効なフィルター条件がありません。全件表示などを行います。");
      setSearchData(null);
      return;
    }

    // 4. 実際にリクエストURLを生成
    const url = createRequestUrl(
      "http://localhost:8000/api/national-pokemon/",
      effectiveStatuses,
      0,
      24
    );
    console.log("Request URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status}`);
      }
      const data: PokemonListResponse = await response.json();
      console.log("取得したデータ:", data);
      setSearchData(data);
    } catch (error) {
      console.error("データ取得エラー:", error);
      alert("データ取得エラーが発生しました。");
    }
  };

  return (
    <Box mt="6" textAlign="center">
      {/* アイコンをクリックでフィルタ実行 */}
      <Box onClick={handleFilterClick} cursor="pointer" display="inline-block">
        <FaFilter size={24} />
      </Box>
    </Box>
  );
};

export default ShowStatuses;
