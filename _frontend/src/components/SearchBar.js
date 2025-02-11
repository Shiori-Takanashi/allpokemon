// components/SearchBar.js
import { useState } from "react";
import { Input, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  // Enterキー押下でも検索を実行
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        placeholder="検索ワードを入力..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <InputRightElement width="4.5rem">
        <IconButton
          h="1.75rem"
          size="sm"
          icon={<SearchIcon />}
          onClick={() => onSearch(query)}
          aria-label="検索"
        />
      </InputRightElement>
    </InputGroup>
  );
}
