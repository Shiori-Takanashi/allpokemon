// src/PokemonCards/components/StatusSetter.tsx
"use client";

import React from "react";
import Select, { components, OptionProps } from "react-select";
import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { NumericFormat } from "react-number-format";
import { OptionType, StatusSetterProps } from "@/PokemonCards02/types/types";

/* ===============================
   1. 共通スタイル（react-select等に適用）
================================= */
const commonControlStyles = {
  width: "92px",
  height: "32px",
  minHeight: "32px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
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

/** react-select の Option コンポーネントを上書き（ラベル表示のカスタマイズなどが可能） */
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
    border-color: #69a2ff; /* フォーカス時の色を変更 */
  }
`;

/* ===============================
   3. 「---」を含む選択肢データ
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

const operator: OptionType[] = [
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
}) => (
  <Box
    // wrapper相当のスタイルを統合
    display="flex"
    flexDirection="column"
    alignItems="center"
    padding="1rem"
    backgroundColor="#f0f2f5"
    width="120px"
    borderRadius="md"
  >
    {/* ステータス選択 */}
    <Select<OptionType>
      options={stats}
      value={selectedStat}
      onChange={(option) => option && setSelectedStat(option)}
      isSearchable={false}
      components={customComponents}
      styles={selectStyles}
    />

    {/* 演算子選択 */}
    <Box marginTop="8px">
      <Select<OptionType>
        options={operator}
        value={selectedOperator}
        onChange={(option) => option && setSelectedOperator(option)}
        isSearchable={false}
        components={customComponents}
        styles={selectStyles}
      />
    </Box>

    {/* 数値入力 */}
    <Box marginTop="8px">
      <StyledNumericFormat
        value={value}
        placeholder="数値"
        onValueChange={(values) => setValue(values.value)}
      />
    </Box>
  </Box>
);

export default StatusSetter;
