// src/components/PokemonSpeedTable.js
import { useState, useRef } from "react";
import { Box, Flex, Input, InputGroup, InputRightElement, IconButton, Text } from "@chakra-ui/react";
import { SearchIcon, ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import * as wanakana from "wanakana";
import PaldeaSpeedPatternsTable from "./PaldeaSpeedPatternsTable";

export default function PokemonSpeedTable() {
  const tableContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [inputVisible, setInputVisible] = useState(false);

  // 検索アイコンを押すと検索バーを表示
  const handleIconClick = () => setInputVisible(true);

  // 検索入力時の処理（カタカナ変換）
  const handleInputChange = (e) => {
    const katakana = wanakana.toKatakana(e.target.value);
    setSearchQuery(katakana);
  };

  // 検索処理
  const handleSearch = () => {
    clearHighlights();
    if (!tableContainerRef.current) return;
    const cells = tableContainerRef.current.querySelectorAll("tbody tr td:nth-child(2)");
    const newMatches = [];
    cells.forEach((cell) => {
      const text = cell.textContent;
      if (text.startsWith(searchQuery)) {
        newMatches.push(cell);
        const prefix = text.slice(0, searchQuery.length);
        const rest = text.slice(searchQuery.length);
        cell.innerHTML = `<span style="background-color:yellow;">${prefix}</span>${rest}`;
      }
    });
    setMatches(newMatches);
    setCurrentMatchIndex(0);
  };

  // 既存ハイライトをクリア
  const clearHighlights = () => {
    if (!tableContainerRef.current) return;
    const cells = tableContainerRef.current.querySelectorAll("tbody tr td:nth-child(2)");
    cells.forEach((cell) => {
      cell.innerHTML = cell.textContent;
    });
  };

  // マッチした結果へスクロール
  const navigateToMatch = (index) => {
    if (matches.length === 0) return;
    const cell = matches[index];
    if (cell) {
      cell.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // マッチの移動処理
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
      {/* 検索バー（スクロールしても固定） */}
      <Box position="sticky" top="0" bg="white" zIndex="10" p={2} borderBottom="1px solid" borderColor="gray.200">
        <Flex justifyContent="space-between" alignItems="center">
          {inputVisible ? (
            <InputGroup w="100%">
              <Input value={searchQuery} onChange={handleInputChange} placeholder="検索（日本語入力）" />
              <InputRightElement>
                <IconButton aria-label="検索" icon={<SearchIcon />} size="sm" onClick={handleSearch} />
              </InputRightElement>
            </InputGroup>
          ) : (
            <Flex flex="1" justifyContent="flex-end">
              <IconButton aria-label="検索表示" icon={<SearchIcon />} onClick={handleIconClick} />
            </Flex>
          )}
        </Flex>
        {matches.length > 0 && (
          <Flex mt={2} justifyContent="space-between" alignItems="center">
            <Text>{matches.length} match</Text>
            <Box>
              <IconButton aria-label="上へ" icon={<ChevronUpIcon />} size="sm" onClick={handleNavigateUp} mr={2} />
              <IconButton aria-label="下へ" icon={<ChevronDownIcon />} size="sm" onClick={handleNavigateDown} />
            </Box>
          </Flex>
        )}
      </Box>

      {/* 既存の PaldeaSpeedPatternsTable をテーブルコンテナとして保持 */}
      <Box ref={tableContainerRef}>
        <PaldeaSpeedPatternsTable />
      </Box>
    </Box>
  );
}
