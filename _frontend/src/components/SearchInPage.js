// src/components/SearchBar.js
import { useState } from "react";
import { Box, Flex, Input, InputGroup, InputRightElement, IconButton, Text } from "@chakra-ui/react";
import { SearchIcon, ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import * as wanakana from "wanakana";

export default function SearchBar({
  onSearch,
  matchCount,
  onNavigateUp,
  onNavigateDown,
  showNavigation,
}) {
  const [inputVisible, setInputVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 検索アイコンを押すと入力欄を表示
  const handleIconClick = () => {
    setInputVisible(true);
  };

  // 入力時に日本語のみ受け付け、即時カタカナに変換
  const handleInputChange = (e) => {
    const katakana = wanakana.toKatakana(e.target.value);
    setSearchText(katakana);
  };

  const handleSearchClick = () => {
    onSearch(searchText);
  };

  return (
    <Box
      position="sticky"
      top="0"
      bg="white"
      zIndex="10"
      p={2}
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <Flex justifyContent="space-between" alignItems="center">
        {inputVisible ? (
          <InputGroup w="100%">
            <Input
              value={searchText}
              onChange={handleInputChange}
              placeholder="検索（日本語入力）"
            />
            <InputRightElement>
              <IconButton
                aria-label="検索"
                icon={<SearchIcon />}
                size="sm"
                onClick={handleSearchClick}
              />
            </InputRightElement>
          </InputGroup>
        ) : (
          // 入力欄非表示時は右端に検索アイコンのみ表示
          <Flex flex="1" justifyContent="flex-end">
            <IconButton
              aria-label="検索表示"
              icon={<SearchIcon />}
              onClick={handleIconClick}
            />
          </Flex>
        )}
      </Flex>
      {showNavigation && (
        <Flex mt={2} justifyContent="space-between" alignItems="center">
          <Text>{matchCount} match</Text>
          <Box>
            <IconButton
              aria-label="上へ"
              icon={<ChevronUpIcon />}
              size="sm"
              onClick={onNavigateUp}
              mr={2}
            />
            <IconButton
              aria-label="下へ"
              icon={<ChevronDownIcon />}
              size="sm"
              onClick={onNavigateDown}
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
