"use client";

import React from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";
import { ShowStatusesProps } from "@/PokemonCards/types/types";

/**
 * 単に「フィルター実行」を親に通知するだけのボタン
 * バリデーションはすべて親コンポーネントに集約する
 */
const ShowStatuses: React.FC<ShowStatusesProps> = ({ onFilter }) => {
  return (
    <Box mb="6" textAlign="center">
      <HStack gap={4} justify="center">
        <Box cursor="pointer" onClick={onFilter}>
          <FaFilter size={24} />
        </Box>
        {/* <Button variant="outline" size="sm" onClick={onFilter}>
          フィルタ実行
        </Button> */}
      </HStack>
    </Box>
  );
};

export default ShowStatuses;
