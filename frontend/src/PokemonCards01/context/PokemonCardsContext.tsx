// src/PokemonCards/context/PokemonCardsContext.tsx
import React, { createContext, useContext } from "react";
import { usePokemonCards } from "@/PokemonCards01/hooks/usePokemonCards";

const PokemonCardsContext =
  createContext<ReturnType<typeof usePokemonCards> | null>(null);

export const PokemonCardsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = usePokemonCards();
  return (
    <PokemonCardsContext.Provider value={value}>
      {children}
    </PokemonCardsContext.Provider>
  );
};

export  const usePokemonCardsContext = () => {
  const context = useContext(PokemonCardsContext);
  if (!context) {
    throw new Error(
      "usePokemonCardsContext must be used inside PokemonCardsProvider"
    );
  }
  return context;
};
