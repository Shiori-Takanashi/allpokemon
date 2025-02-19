// src/components/PokemonCardsContent/hooks/usePokemonUI.ts

import { useState } from "react";

/**
 * ポケモンの実数値表示など、UI 特有のトグルや状態を管理するフック
 */
export function usePokemonUI() {
  // 実数値表示をするかどうか
  const [showActualStats, setShowActualStats] = useState<boolean>(false);

  return {
    showActualStats,
    setShowActualStats,
  };
}
