// src/components/PokemonCards/ui/TypeSelect.tsx
import React from "react";
import ReactSelect from "react-select";


import { usePokemonCardsContext } from "../context/Context";
import { typeOptionsReact, SelectOption } from "../logics/filterPokemons";

const selectCustomStyles: any = {
  control: (provided: any) => ({
    ...provided,
    width: 120,
    textAlign: "center",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    textAlign: "center",
  }),
  option: (provided: any) => ({
    ...provided,
    textAlign: "center",
  }),
  menu: (provided: any) => ({
    ...provided,
    textAlign: "center",
  }),
};

interface Props {
  onSearchClick: () => void;
  icon?: React.ReactNode;
}

const TypeSelect: React.FC<Props> = () => {
  const {
    selectedType1,
    selectedType2,
    setSelectedType1,
    setSelectedType2,
  } = usePokemonCardsContext();

  return (
    <div style={{ background: "#f0f0f0", padding: "8px", borderRadius: "4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <ReactSelect
          value={selectedType1}
          onChange={(option) => {
            if (option) setSelectedType1(option as SelectOption);
          }}
          options={typeOptionsReact}
          styles={selectCustomStyles}
          isSearchable={false}
        />
        <ReactSelect
          value={selectedType2}
          onChange={(option) => {
            if (option) setSelectedType2(option as SelectOption);
          }}
          options={typeOptionsReact}
          styles={selectCustomStyles}
          isSearchable={false}
        />
      </div>
    </div>
  );
};

export default TypeSelect;
