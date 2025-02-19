// components/SearchDataDisplay.tsx
import React from 'react';
import { Box, Text, Image } from '@chakra-ui/react';
import { SearchDataDisplayProps, PokemonDetail } from '../types/types';

const SearchDataDisplay: React.FC<SearchDataDisplayProps> = ({ data }) => {
  return (
    <Box mt="6" justifyItems="center">
      {/* 検索結果件数の表示 */}
      <Text fontSize="lg" fontWeight="bold" mb="4">
        {data.count}件
      </Text>

      {/* 検索結果の一覧 */}
      {data.results.map((pokemon: PokemonDetail) => (
        <Box
          key={pokemon.ids.unique_id}
          p="3"
          mb="4"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="xl"
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="160px"
          height="160px"
        >
          {/* ポケモン名 */}
          <Text fontWeight="semibold" mb="2">
            {pokemon.names.ja}
          </Text>

          {/* ポケモン画像 */}
          {pokemon.images.frontUrl ? (
            <Image
              src={pokemon.images.frontUrl}
              alt={pokemon.names.ja}
              boxSize="80px"
              objectFit="cover"
            />
          ) : (
            <Text>画像なし</Text>
          )}

          {/* タイプの一覧 */}
          <Text>
            {pokemon.type_.join(' ・ ')}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default SearchDataDisplay;
