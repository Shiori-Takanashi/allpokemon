// src/PokemonCards/UI/ButtonGroup.tsx

// ==================== インポート ==================== //
// React と Context フック、及び各種アイコンをインポートする
import React from "react";
import { FaMapMarkedAlt, FaExclamationCircle, FaSearch, FaTimesCircle } from "react-icons/fa";
import { BsClipboardDataFill } from "react-icons/bs";
import { PiArrowFatLinesDownFill } from "react-icons/pi";
import { IoIosHome } from "react-icons/io";
import { usePokemonCardsContext } from "../context/PokemonCardsContext";

// ==================== メインコンポーネント ==================== //

/** 
 * ButtonGroup コンポーネント（関数）
 * 
 * UI 上部に配置される各モーダルを開くボタン群と全リセットボタンを
 * グループ化して表示するコンテナコンポーネントです。
 */
const ButtonGroup: React.FC = () => {
  // ==================== コンテキスト状態取得 ==================== //
  // Context から各モーダルの開閉状態、トグル、リセット用関数などを取得する
  const {
    isEndpointModalOpen,
    setIsEndpointModalOpen,
    isExplanationOpen,
    setIsExplanationOpen,
    isLinksModalOpen,
    setIsLinksModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    showActualStats,
    setShowActualStats,
    showAll,
    toggleShowAll,
    resetAllStates,
  } = usePokemonCardsContext();

  return (
    // JSX: ボタン群全体のコンテナ
    <div
      className="button-group"
      style={{
        // スタイル: フレックスレイアウトで中央揃えし、ボタン間に隙間を設ける
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        padding: "8px",
        backgroundColor: "#f7f7f7",
      }}
    >
      {/* JSX: EndpointsModal を開くボタン */}
      <button
        onClick={() => setIsEndpointModalOpen(true)}
        className="icon-button"
        style={{
          marginLeft: "auto", // 右端寄せのための余白設定
        }}
      >
        <FaMapMarkedAlt size={30} color={isEndpointModalOpen ? "blue" : "black"} />
      </button>

      {/* JSX: LinksModal を開くボタン */}
      <button
        onClick={() => setIsLinksModalOpen(true)}
        className="icon-button"
      >
        <IoIosHome size={30} color={isLinksModalOpen ? "blue" : "black"} />
      </button>

      {/* JSX: 実数値表示トグルボタン */}
      <button
        onClick={() => setShowActualStats(!showActualStats)}
        className="icon-button"
      >
        <BsClipboardDataFill size={30} color={showActualStats ? "blue" : "black"} />
      </button>

      {/* JSX: SearchModal を開くボタン */}
      <button
        onClick={() => setIsSearchModalOpen(true)}
        className="icon-button"
      >
        <FaSearch size={30} color={isSearchModalOpen ? "blue" : "black"} />
      </button>

      {/* JSX: ExplanationModal を開くボタン */}
      <button
        onClick={() => setIsExplanationOpen(true)}
        className="icon-button"
      >
        <FaExclamationCircle size={30} color={isExplanationOpen ? "blue" : "black"} />
      </button>

      {/* JSX: 全件表示トグルボタン */}
      <button
        onClick={toggleShowAll}
        className="icon-button"
      >
        <PiArrowFatLinesDownFill size={30} color={showAll ? "blue" : "black"} />
      </button>

      {/* JSX: リセットボタン */}
      <button onClick={resetAllStates} className="icon-button" title="全リセット">
        <FaTimesCircle size={30} color="red" />
      </button>
    </div>
  );
};

export default ButtonGroup;
