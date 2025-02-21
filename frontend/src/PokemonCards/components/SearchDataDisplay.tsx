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
    <Box mt={4} width="100%" justifyItems="center">
      {/* 総件数 */}
      <Text fontSize="xl" fontWeight="bold" m="6">
        {data.count}件
      </Text>

      <SimpleGrid columns={[1, 2, 3, 4, 6, 8]} gap={4}>
        {data.results.map((pokemon: PokemonDetail) => (
          <Card.Root key={pokemon.ids.unique_id} border="1px solid #ccc">
            <CardHeader alignItems="center">
              {!pokemon.names.subJa ? (
                  <Text fontWeight="semibold" color="gray.900">
                    {pokemon.names.ja} 
                  </Text>
                ) : (
                  !pokemon.names.subJa.includes("メガ") ? (
                    <>
                    <Text fontWeight="semibold" color="gray.900">
                      {pokemon.names.ja}
                    </Text>
                    <Text color="gray.900" fontSize="xs">
                      {pokemon.names.subJa}
                    </Text>
                    </>
                    ):(
                      <Text fontWeight="semibold" color="gray.900">
                        {pokemon.names.subJa}
                      </Text>
                    )
                )
              }
            </CardHeader>
            <CardBody display="flex" alignItems="center" justifyContent="center">
              {pokemon.images.frontUrl ? (
                <Image
                  src={pokemon.images.frontUrl}
                  alt={pokemon.names.ja}
                  boxSize="90px"
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
