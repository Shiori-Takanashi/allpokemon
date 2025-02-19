// src/pages/index.tsx
"use client";

import React from "react";
import SearchPage from "@/PokemonCards/components/SearchPage";

/**
 * ルートページ
 * 今回は単に SearchPage を表示するだけ
 */
const Index: React.FC = () => {
  return <SearchPage />;
};

export default Index;
