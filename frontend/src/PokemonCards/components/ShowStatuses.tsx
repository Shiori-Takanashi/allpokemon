// src/PokemonCards/components/ShowStatuses.tsx
"use client";

import React from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";
import { ShowStatusesProps } from "@/PokemonCards/types/types";
import { toaster } from "@/components/ui/toaster"; // Chakra UI v3のtoast

const ShowStatuses: React.FC<ShowStatusesProps> = ({ statuses, onFilter }) => {
  /**
   * 例：同じステータスに複数条件が設定されていないか
   * ここで競合チェックをし、あれば toast 表示して return
   * 問題なければ onFilter() を実行
   */
  const handleFilterClick = () => {
    // 同じステータスに複数条件 => 競合とみなす例
    const map: Record<string, number> = {};
    for (const st of statuses) {
      const key = st.selectedStat.value;
      if (key !== "none" && key !== "") {
        map[key] = (map[key] || 0) + 1;
        if (map[key] > 1) {
          toaster.create({
            description: "同じステータスに複数の条件があります。フィルターを実行しません。",
            type: "warning",
          });
          return;
        }
      }
    }
    onFilter();
  };

  return (
    <Box mt="6" textAlign="center">
      <HStack gap={4} justify="center">
        <Box cursor="pointer" onClick={handleFilterClick}>
          <FaFilter size={24} />
        </Box>
        <Button variant="outline" size="sm" onClick={handleFilterClick}>
          フィルタ実行
        </Button>
      </HStack>
    </Box>
  );
};

export default ShowStatuses;
