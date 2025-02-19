// src/components/PokemonCards/ui/SearchInput.tsx
import React from "react";
import { usePokemonCardsContext } from "@/PokemonCards01/context/PokemonCardsContext";

// プレーンCSSファイルをインポート
// このファイルでは、SearchInput コンポーネントのスタイル（背景色、パディング、角丸、入力フィールドのデザインなど）が定義されています
import "../../style/SearchInput.css";

// SearchInput コンポーネントは、ユーザーがポケモン名を入力するためのテキストフィールドを提供します。
// このコンポーネントは、グローバルなコンテキストから検索用の値や関数を取得して、ユーザー入力に基づく検索処理を行います。
const SearchInput: React.FC = () => {
  // usePokemonCardsContext フックを利用して、現在の検索文字列（searchTerm）、
  // 検索文字列を更新する関数（setSearchTerm）、
  // そして検索処理を実行する関数（handleSearch）を取得します。
  // これにより、複数のコンポーネント間で検索状態や処理を共有することができます。
  const { searchTerm, setSearchTerm, handleSearch } = usePokemonCardsContext();

  return (
    // コンテナ div
    // この div は、SearchInput コンポーネント全体の背景やレイアウトを定義します。
    // クラス名 "search-input-container" により、プレーンCSSで設定された背景色、パディング、角丸、幅制限などのスタイルが適用されます。
    <div className="search-input-container">
      
      {/*
        入力フィールド (input 要素)
        
        ・type="text":
          - テキスト入力フィールドであることを示しています。
          
        ・value={searchTerm}:
          - 入力フィールドの現在の値は、コンテキストから取得した searchTerm です。
          - これにより、ユーザーが入力した文字列が反映され、他のコンポーネントと共有されます。
          
        ・onChange={(e) => setSearchTerm(e.target.value)}:
          - ユーザーが入力フィールドに文字を入力するたびに、このイベントハンドラーが呼ばれます。
          - イベントオブジェクト (e) から入力された値を取得し、setSearchTerm を用いてコンテキスト内の searchTerm を更新します。
          
        ・onKeyDown={(e) => e.key === "Enter" && handleSearch()}:
          - ユーザーがキーボード操作を行ったときに発火するイベントです。
          - Enter キーが押された場合、handleSearch 関数が実行され、検索処理が開始されます。
          
        ・placeholder="ポケモン名を入力":
          - 入力フィールドが空の場合に表示されるヒントテキストです。
          - ユーザーに対して、どのような情報を入力すれば良いかを示します。
          
        ・className="search-input-field":
          - このクラス名により、入力フィールドに対してプレーンCSSファイルで定義されたスタイルが適用されます。
          - 具体的には、パディング、フォントサイズ、境界線、角丸、アウトラインの設定などが行われます。
      */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="ポケモン名を入力"
        className="search-input-field"
      />
      
    </div>
  );
};

export default SearchInput;
