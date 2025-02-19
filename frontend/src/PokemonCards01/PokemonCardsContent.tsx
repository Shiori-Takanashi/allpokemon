// src/PokemonCards/PokemonCardsContent.tsx

// ==================== インポート ==================== //
// React、スタイル、Context、及び下位UIコンポーネントをインポート
import React from "react";
import "@/PokemonCards01/style/main.css";
import "@/PokemonCards01/style/PokemonCards.css";
import { PokemonCardsProvider, usePokemonCardsContext } from "@/PokemonCards01/context/PokemonCardsContext";
import ButtonGroup from "@/PokemonCards01/UI/ButtonGroup";
import ModalGroup from "@/PokemonCards01/UI/ModalGroup";
import RagionName from "@/PokemonCards01/UI/RegionName";
import PokemonCard from "@/PokemonCards01/UI/PokemonCard";
import TopPagination from "@/PokemonCards01/UI/TopPagination";

// ==================== メインコンポーネント ==================== //
/**
 * PokemonCardsContent コンポーネント（関数）
 * 
 * Context Provider をラップし、内部のレイアウトコンポーネント（InnerLayout）を表示する。
 */
const PokemonCardsContent: React.FC = () => {
  return (
    // JSX: Provider でアプリ全体の状態を共有
    <PokemonCardsProvider>
      <InnerLayout />
    </PokemonCardsProvider>
  );
};

export default PokemonCardsContent;


// ==================== 内部レイアウトコンポーネント ==================== //
/**
 * InnerLayout コンポーネント（関数）
 * 
 * Context から状態を取得し、下位UIコンポーネント（ボタン群、モーダル群、地域名、ページネーション、ポケモンカード一覧）を統合して表示する。
 */
const InnerLayout: React.FC = () => {
  // ==================== コンテキスト状態の取得 ==================== //
  // Context から各種状態や関数を取得する
  const {
    isSpinner,
    regionName,
    filteredData,      // フィルタ後の全ポケモンリスト
    displayedData,     // ページネーション後に表示するリスト
    totalPages,
    currentPage,
    showAll,
    showActualStats,
    setCurrentPage,
  } = usePokemonCardsContext();

  // ==================== ページネーション関連の計算 ==================== //
  // 全件数、1ページあたりの件数、開始インデックス、終了インデックスを計算する
  const totalPokemonCount = filteredData.length;
  const itemsPerPage = 48; // 必要に応じて Context から取得する
  const startIndex = totalPokemonCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalPokemonCount);

  // ==================== ローディング状態のガード ==================== //
  if (isSpinner) {
    return (
      // JSX: ローディング状態表示用コンテナ
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  return (
    // JSX: 全体のコンテナ
    <div className="pokemon-container">
      
      {/* ==================== ボタン群 ==================== */}
      {/* JSX: 上部に配置される各種モーダルを開くボタンとリセットボタン */}
      <ButtonGroup />

      {/* ==================== モーダル群 ==================== */}
      {/* JSX: 各モーダル（Endpoints, Links, Explanation, Search）の表示 */}
      <ModalGroup />

      {/* ==================== 地域名表示 ==================== */}
      {/* JSX: 地域名を大きく表示する */}
      <RagionName regionName={regionName} />

      {/* ==================== ページネーション ==================== */}
      {/* JSX: TopShown コンポーネントを表示 */}
      <TopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalPokemonCount}
        showAll={showAll}
        startIndex={startIndex}
        endIndex={endIndex}
        onPrev={() => setCurrentPage((prev: number) => prev - 1)}
        onNext={() => setCurrentPage((prev: number) => prev + 1)}
      />

      {/* ==================== ポケモンカード一覧 ==================== */}
      {/* JSX: 表示するポケモンデータの一覧をカード形式でレンダリングする */}
      <div className="pokemon-cards">
        {displayedData.map((pokemon) => (
          <PokemonCard
            key={pokemon.unique_id}
            pokemon={pokemon}
            showActualStats={showActualStats}
          />
        ))}
      </div>
    </div>
  );
};
