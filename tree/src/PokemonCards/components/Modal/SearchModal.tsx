// src/components/PokemonCards/parts/SearchModal.tsx
import React from "react";

// 既存の SearchInput, TypeSelect をインポート
// SearchInput: ユーザーが検索ワードを入力するテキストフィールド
// TypeSelect: ユーザーがタイプを選択するためのドロップダウンコンポーネント
import SearchInput from "../SearchElement/SearchInputer";
import TypeSelect from "../SearchElement/TypeSelecter";

// コンテキストから検索処理や状態を取得するためのフックをインポート
import { usePokemonCardsContext } from "../../context/PokemonCardsContext";

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
      
      {/* モーダルコンテンツエリア */}
      <div className="search-modal-content">
        
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="search-modal-close-button"
        >
          &times;
        </button>

        {/* 検索入力フィールドのコンテナ */}
        <div className="search-modal-input-wrapper">
          <SearchInput />
        </div>

        {/* タイプ選択コンポーネントのコンテナ */}
        <div className="search-modal-type-select-wrapper">
          <TypeSelect onSearchClick={handleSearchClick} />
        </div>

        {/* 検索ボタンのラッパー */}
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
