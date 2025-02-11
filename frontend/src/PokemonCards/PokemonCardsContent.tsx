// src/components/Main/PokemonCardsContent.tsx

import React from "react";
import "@/PokemonCards/style/PokemonCards.css";

// Context の Provider と呼び出しフック
import { PokemonCardsProvider, usePokemonCardsContext } from "@/PokemonCards/context/PokemonCardsContext";

// 下位コンポーネント
import TopActions from "@/PokemonCards/components/TopActions";
import Pagination from "@/PokemonCards/components/Pagination";
import PokemonCards from "@/PokemonCards/components/PokemonCards";
import EndpointsModal from "@/PokemonCards/components/EndpointsModal";
import ExplanationModal from "@/PokemonCards/components/ExplanationModal";

/**
 * 親コンポーネント: Provider でラップ → 子要素 (InnerLayout) で状態を参照
 */
const PokemonCardsContent: React.FC = () => {
  return (
    <PokemonCardsProvider>
      <InnerLayout />
    </PokemonCardsProvider>
  );
};

export default PokemonCardsContent;

/**
 * 実際の描画を行うコンポーネント
 * 同じファイル内にまとめることで、Layout ファイルを分割せずに済む
 */
const InnerLayout: React.FC = () => {
  // usePokemonCardsContext で状態を取得
  const {
    isSpinner,
    isEndpointModalOpen,
    isExplanationOpen,
    regionName,
    displayedData,
    totalPages,
    currentPage,
    showAll,
    showActualStats,
    endpoints,
    setIsEndpointModalOpen,
    setIsExplanationOpen,
    setCurrentPage,
    setApiUrl,
  } = usePokemonCardsContext();

  // スピナー表示
  if (isSpinner) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  // 通常表示
  return (
    <div className="pokemon-container">
      {/* 上部の操作エリア */}
      <TopActions />

      {/* EndpointsModal */}
      <EndpointsModal
        isOpen={isEndpointModalOpen}
        onClose={() => setIsEndpointModalOpen(false)}
        endpoints={endpoints}
        setApiUrl={setApiUrl}
      />

      {/* ExplanationModal */}
      <ExplanationModal
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
      />

      {/* 地方名 */}
      <h2 style={{ fontWeight: "bold", fontSize: "30px", textAlign: "center", margin: 36 }}>
        {regionName}
      </h2>

      {/* ページネーション */}
      {!showAll && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((prev) => prev - 1)}
          onNext={() => setCurrentPage((prev) => prev + 1)}
        />
      )}

      {/* ポケモンカード一覧 */}
      <PokemonCards pokemons={displayedData} showActualStats={showActualStats} />
    </div>
  );
};
