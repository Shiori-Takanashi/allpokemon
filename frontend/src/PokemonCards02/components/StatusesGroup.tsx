// components/StatusesGroup.tsx
"use client";
import React from "react";
import { Box } from "@chakra-ui/react";
import StatusSetters from "./StatusSetters";
import ShowStatuses from "./ShowStatuses";
import { StatusGroupProps, Status, PokemonListResponse } from "../types/types";

interface ExtendedStatusGroupProps extends StatusGroupProps {
  setSearchData: (data: PokemonListResponse | null) => void;
}

const StatusGroup: React.FC<ExtendedStatusGroupProps> = ({
  statuses,
  setStatuses,
  setSearchData,
}) => {
  const updateStatus = (index: number, newStatus: Partial<Status>) => {
    setStatuses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...newStatus };
      return updated;
    });
  };

  return (
    <Box>
      <StatusSetters statuses={statuses} updateStatus={updateStatus} />
      {/* setSearchDataを渡すことで、ShowStatusesから更新可能に */}
      <ShowStatuses statuses={statuses} setSearchData={setSearchData} />
    </Box>
  );
};

export default StatusGroup;
