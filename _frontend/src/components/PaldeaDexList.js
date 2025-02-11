// src/components/PaldeaDexList.js
import { useEffect, useState } from "react";
import { Box, Text, VStack, Spinner, Alert, AlertIcon } from "@chakra-ui/react";

const API_URL = "http://localhost:8000/api/paldea-region-dex-pokemon/";

export default function PaldeaDexList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        return response.json();
      })
      .then((data) => {
        setPokemonList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner size="s" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {pokemonList.map((pokemon) => (
        <Box
          key={pokemon.name}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          shadow="md"
        >
          <Text fontSize="xl" fontWeight="bold">
            {pokemon.name}
          </Text>
          <Text>HP: {pokemon.base_h}</Text>
          <Text>攻撃: {pokemon.base_a}</Text>
          <Text>防御: {pokemon.base_b}</Text>
          <Text>特攻: {pokemon.base_c}</Text>
          <Text>特防: {pokemon.base_d}</Text>
          <Text>素早さ: {pokemon.base_s}</Text>
          <Text>合計: {pokemon.base_t}</Text>
        </Box>
      ))}
    </VStack>
  );
}
