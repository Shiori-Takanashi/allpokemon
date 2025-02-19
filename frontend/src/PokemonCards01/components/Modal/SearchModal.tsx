// src/components/PokemonCards/parts/SearchModal.tsx
import React from "react";

// 既存の SearchInput, TypeSelect をインポート
// SearchInput: ユーザーが検索ワードを入力するテキストフィールド
// TypeSelect: ユーザーがタイプを選択するためのドロップダウンコンポーネント
import SearchInput from "@/PokemonCards01/components/SearchElement/SearchInputer";
import TypeSelect from "@/PokemonCards01/components/SearchElement/TypeSelecter";

// コンテキストから検索処理や状態を取得するためのフックをインポート
import { usePokemonCardsContext } from "@/PokemonCards01/context/PokemonCardsContext";

// このモーダル専用のスタイルを定義したプレーンCSSファイルをインポート
import "../../style/SearchModal.css";

/** 
 * Props の型定義
 * isOpen: モーダルの表示状態を示す真偽値
 * onClose: モーダルを閉じる際に実行する関数
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SearchModal コンポーネント
 * ----------------------------------------------------------
 * このコンポーネントは、以下の役割を担います：
 * 1. ユーザーに検索のための入力フォームを提供する
 *    - SearchInput コンポーネントにより、テキスト入力を実現
 * 2. ユーザーにタイプ選択のオプションを提供する
 *    - TypeSelect コンポーネントにより、選択肢が表示される
 * 3. 検索処理を実行し、モーダルを閉じる
 *    - コンテキストから取得した handleSearch を実行
 *    - onClose 関数でモーダルを非表示にする
 * ----------------------------------------------------------
 */
const SearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  // グローバルコンテキストから検索処理用の handleSearch 関数を取得
  // この関数は、ユーザーが検索を実行する際のロジックを担います
  const { handleSearch } = usePokemonCardsContext();

  // モーダルが閉じる状態の場合、何もレンダリングせず null を返す
  // これにより、不必要な DOM 要素の生成を防ぎます
  if (!isOpen) return null;

  // 検索ボタンやタイプ選択内の検索実行で呼び出す関数
  // 1. handleSearch を実行して検索を開始
  // 2. onClose を実行してモーダルを閉じる
  const handleSearchClick = () => {
    handleSearch();
    onClose();
  };

  return (
    // モーダル全体を覆うオーバーレイ
    // 半透明の背景で、モーダルコンテンツを画面中央に配置します
    <div className="search-modal-overlay">
      
      {/*
        モーダルコンテンツエリア
        -----------------------------------------------
        このエリアは、白い背景のボックスとして表示され、
        パディングや角丸が適用されています。
        また、position: relative により、内部の
        閉じるボタンなどの絶対配置が可能となります。
        -----------------------------------------------
      */}
      <div className="search-modal-content">
        
        {/*
          閉じるボタン
          -----------------------------------------------
          - 画面右上に固定配置されています。
          - クリックすると、onClose 関数が実行され、モーダルが閉じます。
          - "&times;" は一般的な「閉じる」記号として機能します。
          -----------------------------------------------
        */}
        <button
          onClick={onClose}
          className="search-modal-close-button"
        >
          &times;
        </button>

        {/*
          検索入力フィールドのコンテナ
          -----------------------------------------------
          このコンテナは SearchInput コンポーネントを内包し、
          ユーザーが検索ワードを入力できるようにします。
          マージンにより、上部に十分なスペースを確保しています。
          -----------------------------------------------
        */}
        <div className="search-modal-input-wrapper">
          <SearchInput />
        </div>

        {/*
          タイプ選択コンポーネントのコンテナ
          -----------------------------------------------
          このコンテナは TypeSelect コンポーネントを内包し、
          ユーザーが検索条件としてタイプを選択できるようにします。
          SearchInput との間に適切な余白が設けられています。
          -----------------------------------------------
        */}
        <div className="search-modal-type-select-wrapper">
          <TypeSelect onSearchClick={handleSearchClick} />
        </div>

        {/*
          検索ボタンのラッパー
          -----------------------------------------------
          このラッパーは、検索ボタンを右下に配置します。
          ボタンがクリックされると、handleSearchClick が実行され、
          検索が開始され、モーダルが閉じられます。
          -----------------------------------------------
        */}
        <div className="search-modal-button-wrapper">
          <button
            onClick={handleSearchClick}
            className="search-modal-search-button"
          >
            検索
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
