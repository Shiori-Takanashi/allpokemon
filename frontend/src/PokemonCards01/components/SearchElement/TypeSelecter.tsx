// src/components/PokemonCards/ui/TypeSelect.tsx
import React from "react";
import ReactSelect from "react-select";

import { usePokemonCardsContext } from "../../context/PokemonCardsContext";
import { typeOptionsReact } from "../../logics/filterPokemons";
import { SelectOption } from "@/PokemonCards01/types/types";

// プレーンCSSファイルをインポート
// このファイルには TypeSelect の背景、レイアウト、
// ReactSelect 用のスタイルが定義されています
import "../../style/TypeSelecter.css";

// Props インターフェースの定義
// onSearchClick: 検索実行時の処理
// icon: 任意のアイコン
interface Props {
  onSearchClick: () => void;
  icon?: React.ReactNode;
}

// TypeSelect コンポーネントの定義
// このコンポーネントは、2つの ReactSelect を使って
// ユーザーにタイプ選択を提供します
const TypeSelect: React.FC<Props> = () => {
  // コンテキストから以下を取得：
  // selectedType1, selectedType2 - 現在選択されているタイプ
  // setSelectedType1, setSelectedType2 - タイプ更新用の関数
  const {
    selectedType1,
    selectedType2,
    setSelectedType1,
    setSelectedType2,
  } = usePokemonCardsContext();

  return (
    // コンポーネント全体のコンテナ
    // "type-select-container" で背景、パディング、角丸のスタイルを適用
    <div className="type-select-container">
      
      {/*
        内部コンテナ：
        "type-select-inner" クラスで Flex レイアウトを設定し、
        子要素 (ReactSelect) を横並びに配置します。
      */}
      <div className="type-select-inner">
        
        {/*
          1つ目の ReactSelect コンポーネント：
          - selectedType1 を表示します。
          - onChange で選択された値を setSelectedType1 で更新。
          - options に typeOptionsReact を指定。
          - classNamePrefix "custom-select" により、プレーンCSSのスタイルが適用。
          - isSearchable を false に設定し、検索ボックスを非表示にします。
        */}
        <ReactSelect
          value={selectedType1}
          onChange={(option) => {
            if (option) {
              setSelectedType1(option as SelectOption);
            }
          }}
          options={typeOptionsReact}
          classNamePrefix="custom-select"
          isSearchable={false}
        />

        {/*
          2つ目の ReactSelect コンポーネント：
          - selectedType2 を表示します。
          - onChange で選択された値を setSelectedType2 で更新。
          - options、classNamePrefix、isSearchable の設定は
            1つ目と同様です。
        */}
        <ReactSelect
          value={selectedType2}
          onChange={(option) => {
            if (option) {
              setSelectedType2(option as SelectOption);
            }
          }}
          options={typeOptionsReact}
          classNamePrefix="custom-select"
          isSearchable={false}
        />

      </div>
    </div>
  );
};

export default TypeSelect;
