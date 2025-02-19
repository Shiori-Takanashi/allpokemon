// src/PokemonCards/context/PokemonCardsContext.tsx
import React, { createContext, useContext, useState } from "react";

interface PokemonCardsContextProps {
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  // その他、必要な状態や関数も追加できます
}

const PokemonCardsContext = createContext<PokemonCardsContextProps | undefined>(undefined);

export const PokemonCardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // itemsPerPage の初期値を48に設定
  const [itemsPerPage, setItemsPerPage] = useState<number>(48);

  return (
    <PokemonCardsContext.Provider value={{ itemsPerPage, setItemsPerPage }}>
      {children}
    </PokemonCardsContext.Provider>
  );
};

export const usePokemonCardsContext = (): PokemonCardsContextProps => {
  const context = useContext(PokemonCardsContext);
  if (!context) {
    throw new Error("usePokemonCardsContext は PokemonCardsProvider 内で使用してください。");
  }
  return context;
};
