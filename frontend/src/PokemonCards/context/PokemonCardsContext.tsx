// src/components/PokemonCards/context/PokemonCardsContext.tsx

import React, { createContext, useContext } from "react";
import { usePokemonCards } from "@/PokemonCards/hooks/usePokemonCards";

/**
 * usePokemonCards() の戻り値を Context として扱うための型
 * null を許容しておき、Provider 未使用時のエラー検知に利用
 */
const PokemonCardsContext = createContext<ReturnType<typeof usePokemonCards> | null>(null);

/**
 * プロバイダコンポーネント
 * 子孫コンポーネントで同じ state を共有できる
 */
export const PokemonCardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = usePokemonCards();
  return (
    <PokemonCardsContext.Provider value={value}>
      {children}
    </PokemonCardsContext.Provider>
  );
};

/**
 * Context から値を取り出すためのカスタムフック
 * これにより子コンポーネントからいつでも usePokemonCards の状態を共有可能
 */
export const usePokemonCardsContext = () => {
  const context = useContext(PokemonCardsContext);
  if (!context) {
    throw new Error("usePokemonCardsContext must be used inside a PokemonCardsProvider.");
  }
  return context;
};
