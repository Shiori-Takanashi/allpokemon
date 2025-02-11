// src/components/SearchablePaldeaTableWrapper.js
import { useState, useRef } from "react";
import { Box } from "@chakra-ui/react";
import SearchBar from "./SearchBar";
import PaldeaSpeedPatternsTable from "./PokemonSpeedTable";

export default function SearchablePaldeaTableWrapper() {
  const tableContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // 既存のテーブル内の label セル（第2列）に対して検索を実施
  const handleSearch = (query) => {
    setSearchQuery(query);
    clearHighlights();
    if (!tableContainerRef.current) return;
    const cells = tableContainerRef.current.querySelectorAll("tbody tr td:nth-child(2)");
    const newMatches = [];
    cells.forEach((cell) => {
      const text = cell.textContent;
      // 入力した文字列（カタカナ）で、先頭部分が一致するかチェック
      if (text.startsWith(query)) {
        newMatches.push(cell);
        // ハイライト（最初の一致部分のみ）
        const prefix = text.slice(0, query.length);
        const rest = text.slice(query.length);
        cell.innerHTML = `<span style="background-color:yellow;">${prefix}</span>${rest}`;
      }
    });
    setMatches(newMatches);
    setCurrentMatchIndex(0);
  };

  // 既存ハイライトをクリア（セルの innerHTML を textContent に戻す）
  const clearHighlights = () => {
    if (!tableContainerRef.current) return;
    const cells = tableContainerRef.current.querySelectorAll("tbody tr td:nth-child(2)");
    cells.forEach((cell) => {
      cell.innerHTML = cell.textContent;
    });
  };

  const navigateToMatch = (index) => {
    if (matches.length === 0) return;
    const cell = matches[index];
    if (cell) {
      cell.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNavigateUp = () => {
    if (matches.length === 0) return;
    const newIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
    setCurrentMatchIndex(newIndex);
    navigateToMatch(newIndex);
  };

  const handleNavigateDown = () => {
    if (matches.length === 0) return;
    const newIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(newIndex);
    navigateToMatch(newIndex);
  };

  return (
    <Box>
      <SearchBar
        onSearch={handleSearch}
        matchCount={matches.length}
        onNavigateUp={handleNavigateUp}
        onNavigateDown={handleNavigateDown}
        showNavigation={searchQuery !== ""}
      />
      {/* テーブル全体はコンテナにラップし、ref を付与 */}
      <Box ref={tableContainerRef}>
        <PaldeaSpeedPatternsTable />
      </Box>
    </Box>
  );
}
