// src/components/PaldeaDexTable.js
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Alert,
  AlertIcon,
  Box,
} from "@chakra-ui/react";

const API_URL = "http://localhost:8000/api/paldea-region-dex-pokemon/";

export default function PaldeaDexTable() {
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
    return <Spinner size="xl" />;
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
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>名前</Th>
              <Th>HP</Th>
              <Th>攻撃</Th>
              <Th>防御</Th>
              <Th>特攻</Th>
              <Th>特防</Th>
              <Th>素早さ</Th>
              <Th>合計</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pokemonList.map((pokemon) => (
              <Tr key={pokemon.name}>
                <Td fontWeight="bold">{pokemon.name}</Td>
                <Td>{pokemon.base_h}</Td>
                <Td>{pokemon.base_a}</Td>
                <Td>{pokemon.base_b}</Td>
                <Td>{pokemon.base_c}</Td>
                <Td>{pokemon.base_d}</Td>
                <Td>{pokemon.base_s}</Td>
                <Td fontWeight="bold">{pokemon.base_t}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
