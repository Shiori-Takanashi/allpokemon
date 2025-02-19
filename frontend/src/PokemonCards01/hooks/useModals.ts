// src/components/PokemonCardsContent/hooks/useModals.ts

import { useState } from "react";

/**
 * 複数のモーダルを管理したい場合に使うフック
 */
export function useModals() {
  // エンドポイント一覧モーダル
  const [isEndpointModalOpen, setIsEndpointModalOpen] = useState<boolean>(false);
  // 説明モーダル
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);
  // 検索モーダル
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  // その他リンクのモーダル
  const [isLinksModalOpen, setIsLinksModalOpen] = useState<boolean>(false);

  return {
    isEndpointModalOpen,
    setIsEndpointModalOpen,
    isExplanationOpen,
    setIsExplanationOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isLinksModalOpen,
    setIsLinksModalOpen,
  };
}
