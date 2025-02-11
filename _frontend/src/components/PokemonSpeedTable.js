// src/components/PaldeaSpeedPatternsTable.js
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
  Text,
} from "@chakra-ui/react";

// API の URL（適宜変更してください）
const API_URL = "http://http://localhost:8000/api/national-pokemon/";

// 各パターンの実数値を厳密に計算する関数（レベル50, IV=31, 努力値=252 or 0）
function calculateSpeedPatterns(baseSpeed) {
  // 無振（努力値0）
  const s_noInvestment = Math.floor(((baseSpeed * 2 + 31) * 50) / 100 + 5);

  // 準速（努力値252, 性格補正なし）
  const s_neturalmax = Math.floor(((baseSpeed * 2 + 31 + Math.floor(252 / 4)) * 50) / 100 + 5);

  // 最速（準速の1.1倍, 性格補正あり）
  const s_max = Math.floor(s_neturalmax * 1.1);

  // 準速スカーフ（準速の1.5倍）
  const s_neturalmaxScarf = Math.floor(s_neturalmax * 1.5);

  // 最速スカーフ（最速の1.5倍）
  const s_maxScarf = Math.floor(s_max * 1.5);

  return {
    "最ス": s_maxScarf,       // 最速スカーフ
    "最": s_max,              // 最速
    "準ス": s_neturalmaxScarf, // 準速スカーフ
    "準": s_neturalmax,        // 準速
    "無": s_noInvestment,      // 無振
  };
}


export default function PaldeaSpeedPatternsTable() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API からデータを取得
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("データの取得に失敗しました");
        }
        return res.json();
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

  // 各ポケモンの各パターンの実数値を集める
  const entries = [];
  pokemonList.forEach((pokemon) => {
    const patterns = calculateSpeedPatterns(pokemon.base_s);
    Object.entries(patterns).forEach(([patternName, speedValue]) => {
      // エントリーとして、"ポケモン名 (パターン名)" と実数値を保存
      entries.push({
        speed: speedValue,
        label: `${pokemon.name} (${patternName})`,
      });
    });
  });

  // 実数値をキーにグループ化
  const grouped = {};
  entries.forEach((entry) => {
    if (!grouped[entry.speed]) {
      grouped[entry.speed] = [];
    }
    grouped[entry.speed].push(entry.label);
  });

  // 実数値（キー）で降順にソート
  const sortedSpeeds = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>実数値</Th>
              <Th>該当パターン</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedSpeeds.map((speed) => (
              <Tr key={speed}>
                <Td fontWeight="bold">{speed}</Td>
                <Td>
                  {grouped[speed].map((label, idx) => (
                    <Text key={idx}>{label}</Text>
                  ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
