// src/PokemonCards/components/SearchDataDisplay.tsx
"use client";

import React from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
} from "@chakra-ui/react";
import { PokemonListResponse, PokemonDetail } from "@/PokemonCards/types/types";

interface Props {
  data: PokemonListResponse;
}

const SearchDataDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Box mt={4} width="100%">
      {/* 総件数 */}
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        {data.count}件
      </Text>

      <SimpleGrid columns={[1, 2, 3, 4]} gap={4}>
        {data.results.map((pokemon: PokemonDetail) => (
          <Card.Root key={pokemon.ids.unique_id} border="1px solid #ccc">
            <CardHeader alignItems="center">
              <Text fontWeight="semibold">{pokemon.names.ja}</Text>
            </CardHeader>
            <CardBody display="flex" alignItems="center" justifyContent="center">
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
            </CardBody>
            <CardFooter justifyContent="center">
              <Text fontSize="sm" color="gray.600">
                {pokemon.type_.join(" ・ ")}
              </Text>
            </CardFooter>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SearchDataDisplay;
