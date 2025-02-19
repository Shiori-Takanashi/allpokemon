// src/PokemonCards/UI/ModalGroup.tsx

import React from "react";

// Context の Provider と呼び出しフック
import { usePokemonCardsContext } from "../context/PokemonCardsContext";

// 下位コンポーネント（各モーダル）
import EndpointsModal from "../components/Modal/EndpointsModal";
import ExplanationModal from "../components/Modal/ExplanationModal";
import SearchModal from "../components/Modal/SearchModal";
import LinksModal from "../components/Modal/LinksModal";

// 関数：ModalGroup コンポーネント
const ModalGroup: React.FC = () => {
  // Context から必要な状態と関数を取得する
  const {
    isEndpointModalOpen,
    isExplanationOpen,
    isLinksModalOpen,
    isSearchModalOpen,
    endpoints,
    setIsEndpointModalOpen,
    setIsExplanationOpen,
    setIsSearchModalOpen,
    setIsLinksModalOpen,
    setApiUrl,
  } = usePokemonCardsContext();

  return (
    // JSX
    <>
      {/* EndpointsModal の表示（isOpen, onClose, endpoints, setApiUrl を渡す） */}
      <EndpointsModal
        isOpen={isEndpointModalOpen}               // JSX
        onClose={() => setIsEndpointModalOpen(false)} // JSX
        endpoints={endpoints}                        // JSX
        setApiUrl={setApiUrl}                        // JSX
      />

      {/* LinksModal の表示 */}
      <LinksModal
        isOpen={isLinksModalOpen}                    // JSX
        onClose={() => setIsLinksModalOpen(false)}   // JSX
      />

      {/* ExplanationModal の表示 */}
      <ExplanationModal
        isOpen={isExplanationOpen}                   // JSX
        onClose={() => setIsExplanationOpen(false)}  // JSX
      />

      {/* SearchModal の表示 */}
      <SearchModal
        isOpen={isSearchModalOpen}                   // JSX
        onClose={() => setIsSearchModalOpen(false)}  // JSX
      />
    </>
  );
};

export default ModalGroup;
