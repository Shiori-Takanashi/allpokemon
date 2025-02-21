// src/PokemonCards/components/StatusGroup.tsx
"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import  StatusSetters from "@/PokemonCards/components/StatusSetters"
import { StatusGroupProps } from "@/PokemonCards/types/types";

/**
 * フィルタ入力UIをまとめるだけのグループコンポーネント
 * ここではフィルタ実行ボタン(ShowStatuses)は別に呼ばず、
 * SearchPage側などで組み合わせてもOK
 */
const StatusGroup: React.FC<StatusGroupProps> = ({ statuses, setStatuses }) => {
  // 指定インデックスの状態を更新
  const updateStatus = (index: number, newProps: Partial<typeof statuses[number]>) => {
    setStatuses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...newProps };
      return updated;
    });
  };

  return (
    <Box justifyItems="center">
      <StatusSetters statuses={statuses} updateStatus={updateStatus} />
    </Box>
  );
};

export default StatusGroup;
