// src/components/PokemonCards/ui/TopActions.tsx
import React from "react";
import { FaMapMarkedAlt, FaExclamationCircle, FaSearch } from "react-icons/fa";
import { BsClipboardDataFill } from "react-icons/bs";
import { PiArrowFatLinesDownFill } from "react-icons/pi";
import { IoIosHome } from "react-icons/io";
import { usePokemonCardsContext } from "@/PokemonCards/context/Context";
import { FaTimesCircle } from "react-icons/fa";


const TopActions: React.FC = () => {
  const {
    isEndpointModalOpen,
    setIsEndpointModalOpen,
    isExplanationOpen,
    setIsExplanationOpen,
    isLinksModalOpen,
    setIsLinksModalOpen,
    showActualStats,
    setShowActualStats,
    showAll,
    toggleShowAll,
    isSearchModalOpen,
    setIsSearchModalOpen,
    resetAllStates,
  } = usePokemonCardsContext();

  return (
    <div className="top-actions">
      {/* Endpoints Modal (地図アイコン) */}
      <button
        onClick={() => setIsEndpointModalOpen(true)}
        className="icon-button"
        style={{ marginLeft: "auto" }}
      >
        <FaMapMarkedAlt size={30} color={isEndpointModalOpen ? "blue" : "black"} />
      </button>

      {/* リンクモーダル */}
      <button
        onClick={() => setIsLinksModalOpen(true)}
        className="icon-button"
      >
        <IoIosHome size={30} color={isLinksModalOpen ? "blue" : "black"}  />
      </button>

      {/* 実数値表示トグル */}
      <button
        onClick={() => setShowActualStats(!showActualStats)}
        className="icon-button"
      >
        <BsClipboardDataFill size={30} color={showActualStats ? "blue" : "black"} />
      </button>

      {/*　検索画面を開くボタン  */}
      <button
        onClick={() => setIsSearchModalOpen(true)}
        className="icon-button"
      >
        <FaSearch size={30} color={isSearchModalOpen ? "blue" : "black"} />
      </button>

      {/* ステータス計算式モーダル（感嘆符アイコン） */}
      <button
        onClick={() => setIsExplanationOpen(true)}
        className="icon-button"
      >
        <FaExclamationCircle size={30} color={isExplanationOpen ? "blue" : "black"} />
      </button>

      {/* 全件表示トグル（無限アイコン） */}
      <button
        onClick={toggleShowAll}
        className="icon-button"
      >
        <PiArrowFatLinesDownFill size={30} color={showAll ? "blue" : "black"} />
      </button>
      
      <button onClick={resetAllStates} className="icon-button" title="全リセット">
        <FaTimesCircle size={30} color="red" />
      </button>
    </div>
  );
};

export default TopActions;
