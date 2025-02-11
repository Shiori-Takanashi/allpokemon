// src/components/PokemonCards/ui/TopActions.tsx
import React from "react";
import { FaMapMarkedAlt, FaExclamationCircle, FaInfinity, FaCog, FaSearch } from "react-icons/fa";

import LinksModal from "@/PokemonCards/components/LinksModal";
import { usePokemonCardsContext } from "@/PokemonCards/context/PokemonCardsContext";

// 他UI
import SearchInput from "@/PokemonCards/components/SearchInput";
import TypeSelect from "@/PokemonCards/components/TypeSelect";

const TopActions: React.FC = () => {
  const {
    isEndpointModalOpen,
    setIsEndpointModalOpen,
    isExplanationOpen,
    setIsExplanationOpen,
    showActualStats,
    setShowActualStats,
    showAll,
    toggleShowAll,
    handleSearch,
  } = usePokemonCardsContext();

  return (
    <div className="top-actions">
      {/* Endpoints Modal (地図アイコン) */}
      <button
        onClick={() => setIsEndpointModalOpen(true)}
        className="icon-button"
        title="API エンドポイントを選択"
      >
        <FaMapMarkedAlt size={20} color={isEndpointModalOpen ? "blue" : "black"} />
      </button>

      {/* リンクモーダル */}
      <LinksModal />

      {/* 検索入力フォーム */}
      <SearchInput />

      {/* タイプ選択 & 検索 */}
      <TypeSelect onSearchClick={handleSearch} icon={<FaSearch />} />

      {/* 実数値表示トグル（歯車アイコン） */}
      <button
        onClick={() => setShowActualStats(!showActualStats)}
        className="icon-button"
        title="実数値表示"
        style={{ marginLeft: "auto" }}
      >
        <FaCog size={20} color={showActualStats ? "blue" : "black"} />
      </button>

      {/* ステータス計算式モーダル（感嘆符アイコン） */}
      <button
        onClick={() => setIsExplanationOpen(true)}
        className="icon-button"
        title="計算式の説明"
      >
        <FaExclamationCircle size={20} color={isExplanationOpen ? "blue" : "black"} />
      </button>

      {/* 全件表示トグル（無限アイコン） */}
      <button
        onClick={toggleShowAll}
        className="icon-button"
        title="すべて表示"
      >
        <FaInfinity size={20} color={showAll ? "blue" : "black"} />
      </button>
    </div>
  );
};

export default TopActions;
