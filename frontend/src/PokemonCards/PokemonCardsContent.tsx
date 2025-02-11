// src/components/Main/PokemonCardsContent.tsx
import React from "react";
import "@/PokemonCards/style/PokemonCards.css";

// Context の Provider と呼び出しフック
import { PokemonCardsProvider, usePokemonCardsContext } from "@/PokemonCards/context/Context";

// 下位コンポーネント
import TopActions from "@/PokemonCards/components/ButtonGroup";
import Pagination from "@/PokemonCards/components/Pagination";
import PokemonCard from "@/PokemonCards/components/PokemonCard";
import EndpointsModal from "@/PokemonCards/components/EndpointsModal";
import ExplanationModal from "@/PokemonCards/components/ExplanationModal";
import SearchModal from "@/PokemonCards/components/SearchModal";
import LinksModal from "@/PokemonCards/components/LinksModal";

const PokemonCardsContent: React.FC = () => {
  return (
    <PokemonCardsProvider>
      <InnerLayout />
    </PokemonCardsProvider>
  );
};

export default PokemonCardsContent;

const InnerLayout: React.FC = () => {
  // Context から各種状態を取得
  const {
    isSpinner,
    isEndpointModalOpen,
    isExplanationOpen,
    isLinksModalOpen,
    regionName,
    filteredData,    // フィルタ後の全ポケモンリスト（総件数用）
    displayedData,   // ページネーション後に表示するリスト
    totalPages,
    currentPage,
    showAll,
    showActualStats,
    endpoints,
    setIsEndpointModalOpen,
    setIsExplanationOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    setIsLinksModalOpen,
    setCurrentPage,
    setApiUrl,
  } = usePokemonCardsContext();

  // 総件数は全ページにまたがるフィルタ後のポケモン数
  const totalPokemonCount = filteredData.length;

  // ここでは1ページあたりの件数を30件と仮定（必要に応じて Context 等から取得してください）
  const itemsPerPage = 30;
  const startIndex = totalPokemonCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalPokemonCount);

  if (isSpinner) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="pokemon-container">
      {/* 上部の操作エリア */}
      <TopActions />

      {/* 各種モーダル */}
      <EndpointsModal
        isOpen={isEndpointModalOpen}
        onClose={() => setIsEndpointModalOpen(false)}
        endpoints={endpoints}
        setApiUrl={setApiUrl}
      />
      <LinksModal isOpen={isLinksModalOpen} onClose={() => setIsLinksModalOpen(false)} />
      <ExplanationModal isOpen={isExplanationOpen} onClose={() => setIsExplanationOpen(false)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />

      {/* 地域名表示 */}
      <h2
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          textAlign: "center",
          margin: 36,
        }}
      >
        {regionName}
      </h2>

      {/* メインコンポーネント内に直接、全件数を表示 */}
      <div
        style={{
          textAlign: "center",
          fontSize: "18px",
          marginBottom: "16px",
          color: "#555",
        }}
      >
        全 {totalPokemonCount} 匹
      </div>

      {/* 全件表示でない場合のみ、現在のページ範囲（p～q匹目）を表示 */}
      {!showAll && (
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            marginBottom: "16px",
            color: "#777",
          }}
        >
          {totalPokemonCount === 0 ? "0匹目" : `${startIndex}～${endIndex}匹目`}
        </div>
      )}

      {/* ページネーション（全表示フラグが off の場合） */}
      {!showAll && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalPokemonCount}
          onPrev={() => setCurrentPage((prev: number) => prev - 1)}
          onNext={() => setCurrentPage((prev: number) => prev + 1)}
        />
      )}

      {/* ポケモンカード一覧 */}
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
