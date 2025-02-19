// src/PokemonCards/components/StatusSetters.tsx
"use client";

import React from "react";
import { Grid } from "@chakra-ui/react";
import { StatusSettersProps } from "@/PokemonCards/types/types";
import StatusSetter from "./StatusSetter";

const StatusSetters: React.FC<StatusSettersProps> = ({ statuses, updateStatus }) => {
  return (
    <Grid
      templateColumns={["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"]}
      gap="2"
    >
      {statuses.map((st, index) => (
        <StatusSetter
          key={index}
          selectedStat={st.selectedStat}
          setSelectedStat={(option) => updateStatus(index, { selectedStat: option })}
          selectedOperator={st.selectedOperator}
          setSelectedOperator={(option) => updateStatus(index, { selectedOperator: option })}
          value={st.value}
          setValue={(val) => updateStatus(index, { value: val })}
        />
      ))}
    </Grid>
  );
};

export default StatusSetters;
