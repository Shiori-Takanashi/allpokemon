// src/components/PokemonCards/ui/TypeSelect.tsx
import React from "react";
import ReactSelect from "react-select";
import { FaSearch } from "react-icons/fa";

import { usePokemonCardsContext } from "../context/PokemonCardsContext";
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

const TypeSelect: React.FC<Props> = ({ onSearchClick, icon }) => {
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
        <button
          onClick={onSearchClick}
          style={{
            border: "none",
            backgroundColor: "blue",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          title="検索"
        >
          {icon ? icon : <FaSearch />}
        </button>
      </div>
    </div>
  );
};

export default TypeSelect;
