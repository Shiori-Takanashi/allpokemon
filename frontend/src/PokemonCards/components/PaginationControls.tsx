// src/PokemonCards/components/PaginationControls.tsx
"use client";

import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import { PaginationControlsProps } from "@/PokemonCards/types/types";

const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalCount,
  limit,
  offset,
  onOffsetChange,
}) => {
  // 現在のページ(1始まり)
  const currentPage = Math.floor(offset / limit) + 1;
  // 総ページ数
  const totalPages = Math.ceil(totalCount / limit);

  const handlePrev = () => {
    const newOffset = offset - limit;
    onOffsetChange(Math.max(newOffset, 0)); // 負の値にならないように
  };

  const handleNext = () => {
    const newOffset = offset + limit;
    // 最大を超えた分は特に制限しない(API が next=nullを返せば分かる)が、ここで防ぐことも可
    onOffsetChange(newOffset);
  };

  return (
    <HStack gap={4} justify="center" mt={4}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={currentPage <= 1}
      >
        Prev
      </Button>
      <Text fontSize="sm">
        Page {currentPage} / {totalPages || 1}
      </Text>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </HStack>
  );
};

export default PaginationControls;
