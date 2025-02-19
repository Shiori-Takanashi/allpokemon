// components/SearchPage.tsx
"use client";
import React from "react";
import SearchDataDisplay from "./SearchDataDisplay";
import { PokemonListResponse } from "../types/types";

interface SearchPageProps {
  searchData: PokemonListResponse | null;
}

const SearchPage: React.FC<SearchPageProps> = ({ searchData }) => {
  return (
    <div>
      {searchData ? (
        <SearchDataDisplay data={searchData} />
      ) : (
        <p>フィルター条件がありません。<br />または全件表示が行われていません。</p>
      )}
    </div>
  );
};

export default SearchPage;
