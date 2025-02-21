// src/PokemonCards/components/StatusSetter.tsx
"use client";

import React from "react";
import Select, { components, OptionProps } from "react-select";
import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { NumericFormat } from "react-number-format";
import { OptionType, StatusSetterProps } from "@/PokemonCards/types/types";

/* ===============================
   1. 共通スタイル (react-select等)
================================= */
const commonControlStyles = {
  width: "70px",
  minHeight: "32px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "0.8rem",
  display: "flex",
  alignItems: "center",
  lineHeight: "1rem",
  color: "black",
};

const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    ...commonControlStyles,
    boxShadow: "none",
    textAlign: "center",
    border: "1px solid #ccc",
    "&:hover": { border: "1px solid #ccc" },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    justifyContent: "center",
  }),
  input: (provided: any) => ({
    ...provided,
    textAlign: "center",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    textAlign: "center",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    textAlign: "center",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "0.8rem",
    textAlign: "center",
    color: "black",
    backgroundColor: state.isSelected
      ? "#D0E0E3"
      : state.isFocused
      ? "#f0f0f0"
      : "white",
    ":active": { backgroundColor: "#A0C0C3" },
  }),
  menu: (provided: any) => ({
    ...provided,
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
  }),
};

/** react-select の Option コンポーネントを上書き (ラベル表示のカスタマイズなど) */
const CustomOption = (props: OptionProps<OptionType>) => (
  <components.Option {...props}>{props.children}</components.Option>
);

/** react-select に適用するコンポーネントの集合 */
const customComponents = {
  Option: CustomOption,
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

/* ===============================
   2. 数値入力欄のスタイル
================================= */
const StyledNumericFormat = styled(NumericFormat)`
  ${commonControlStyles};
  text-align: center;
  padding: 0;
  &:focus {
    outline: none;
  }
`;

/* ===============================
   3. ドロップダウン用オプション
================================= */
const stats: OptionType[] = [
  { label: "---", value: "none" },
  { label: "HP", value: "hLine" },
  { label: "攻撃", value: "aLine" },
  { label: "防御", value: "bLine" },
  { label: "特攻", value: "cLine" },
  { label: "特防", value: "dLine" },
  { label: "素早さ", value: "sLine" },
  { label: "合計", value: "tLine" },
];

const operators: OptionType[] = [
  { label: "---", value: "none" },
  { label: "一致", value: "eq" },
  { label: "以上", value: "gte" },
  { label: "以下", value: "lte" },
];

/* ===============================
   4. StatusSetter コンポーネント
================================= */
const StatusSetter: React.FC<StatusSetterProps> = ({
  selectedStat,
  setSelectedStat,
  selectedOperator,
  setSelectedOperator,
  value,
  setValue,
  instanceId,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="12px 3px"
      backgroundColor="#f0f2f5"
    >
      {/* ステータス選択 */}
      <Select<OptionType>
        // SSR時のID不整合を防ぐためのプロップ
        instanceId={instanceId ? `${instanceId}-stat` : undefined}
        options={stats}
        value={selectedStat}
        onChange={(option) => option && setSelectedStat(option)}
        isSearchable={false}
        components={customComponents}
        styles={selectStyles}
      />

      {/* 演算子選択 */}
      <Box mt="8px">
        <Select<OptionType>
          instanceId={instanceId ? `${instanceId}-op` : undefined}
          options={operators}
          value={selectedOperator}
          onChange={(option) => option && setSelectedOperator(option)}
          isSearchable={false}
          components={customComponents}
          styles={selectStyles}
        />
      </Box>

      {/* 数値入力 */}
      <Box mt="8px">
        <StyledNumericFormat
          value={value}
          placeholder="数値"
          onValueChange={(values) => setValue(values.value)}
        />
      </Box>
    </Box>
  );
};

export default StatusSetter;
