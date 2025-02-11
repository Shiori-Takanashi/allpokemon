import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Input,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Link
} from '@chakra-ui/react';
import {
  FaCog,
  FaExclamationCircle,
  FaInfinity,
  FaSearch,
  FaMapMarkedAlt,
  FaLink
} from 'react-icons/fa';
import axios from 'axios';
// react-select のインポート（名前が Chakra UI の Select と重複するため ReactSelect として利用）
import ReactSelect from 'react-select';

/** ==========================
 *  リンクモーダル
 *  ========================== */
const LinksModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <IconButton
        aria-label="リンク一覧を表示"
        icon={<FaLink />}
        onClick={openModal}
        colorScheme={isOpen ? 'blue' : 'gray'}
      />
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>関連リンク</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={3}>
              <Link href="https://example.com" color="blue.500" isExternal>
                Example サイト
              </Link>
              <Link href="https://google.com" color="blue.500" isExternal>
                Google
              </Link>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeModal}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

/** ==========================
 *  メインコンポーネント
 *  ========================== */

// タイプ選択肢（最初の2つは "Any" と "None" ）
const typeOptions = [
  'Any',  // 絞り込みなし（複合/単タイプ指定の判定用）
  'None', // 単タイプ指定用（どちらも None の場合は空結果）
  '普',
  '炎',
  '水',
  '電',
  '草',
  '氷',
  '格',
  '毒',
  '地',
  '飛',
  '超',
  '虫',
  '岩',
  '霊',
  '竜',
  '悪',
  '鋼',
  '妖',
];
// react-select 用にオブジェクト配列へ変換
const typeOptionsReact = typeOptions.map(t => ({ value: t, label: t }));

// react-select のスタイル（中央揃え）
const selectCustomStyles = {
  control: (provided) => ({
    ...provided,
    width: '120px',
    textAlign: 'center',
  }),
  singleValue: (provided) => ({
    ...provided,
    textAlign: 'center',
    width: '100%',
  }),
  option: (provided) => ({
    ...provided,
    textAlign: 'center',
  }),
  menu: (provided) => ({
    ...provided,
    textAlign: 'center',
  }),
};

/**
 * APIエンドポイントに応じた地方名を返すユーティリティ
 */
const getRegionName = (apiUrl) => {
  if (apiUrl.includes('national-pokemon')) return '全国版';
  if (apiUrl.includes('galar-pokemon')) return 'ガラル版（剣盾）';
  if (apiUrl.includes('paldea-pokemon')) return 'パルデア版（SV）';
  return '';
};

/**
 * タイプ絞り込みのロジック
 * ・(2) None & None     => 結果0件
 * ・(3) None & Any または Any & None => 単タイプ (TYPE02 が無い)
 * ・(4) Any & Any       => 複合タイプ (TYPE02 が存在)
 * ・さらに、両方に同じ実際のタイプ（例："炎" と "炎"）が選ばれた場合は結果0件とする
 * ・それ以外は、選択されたタイプを含むポケモンを返す
 */
const applyTypeFilter = (data, selectedType1, selectedType2) => {
  // selectedType1,2 はオブジェクト { value, label }
  const t1 = selectedType1.value;
  const t2 = selectedType2.value;

  // (2) None & None
  if (t1 === 'None' && t2 === 'None') {
    return [];
  }

  // (3) None & Any または Any & None => 単タイプ (TYPE02 が無い)
  if ((t1 === 'None' && t2 === 'Any') || (t1 === 'Any' && t2 === 'None')) {
    return data.filter((p) => !p.TYPE02);
  }

  // (4) Any & Any => 複合タイプ (TYPE02 が存在)
  if (t1 === 'Any' && t2 === 'Any') {
    return data.filter((p) => p.TYPE02);
  }

  // さらに、両方に同じ実際のタイプが選ばれていた場合は空結果
  if (t1 === t2 && t1 !== 'Any' && t1 !== 'None') {
    return [];
  }

  // ---- ここからは「実際のタイプ指定」が絡む場合 ----
  let filtered = data;
  if (t1 !== 'Any' && t1 !== 'None') {
    filtered = filtered.filter((p) => p.TYPE01 === t1 || p.TYPE02 === t1);
  }
  if (t2 !== 'Any' && t2 !== 'None') {
    filtered = filtered.filter((p) => p.TYPE01 === t2 || p.TYPE02 === t2);
  }
  return filtered;
};

const PokemonList = () => {
  // APIエンドポイント設定
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api/paldea-pokemon/");
  const [isEndpointModalOpen, setIsEndpointModalOpen] = useState(false);
  const endpoints = [
    { label: "全国版", url: "http://localhost:8000/api/national-pokemon/" },
    { label: "ガラル版（剣盾）", url: "http://localhost:8000/api/galar-pokemon/" },
    { label: "パルデア版（SV）", url: "http://localhost:8000/api/paldea-pokemon/" },
  ];
  const openEndpointModal = () => setIsEndpointModalOpen(true);
  const closeEndpointModal = () => setIsEndpointModalOpen(false);

  // 状態管理
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);       
  const [isLoadingAll, setIsLoadingAll] = useState(false); 
  const [isSearching, setIsSearching] = useState(false);   

  // 検索系
  const [searchTerm, setSearchTerm] = useState('');
  // react-select 用に初期値をオブジェクト形式で設定
  const [selectedType1, setSelectedType1] = useState({ value: 'Any', label: 'Any' });
  const [selectedType2, setSelectedType2] = useState({ value: 'Any', label: 'Any' });

  // ページネーション
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [showAll, setShowAll] = useState(false);
  // 実数値表示
  const [showActualStats, setShowActualStats] = useState(false);
  // 計算式説明モーダル
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  // API データ取得（apiUrl 変更時も再取得）
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiUrl);
        setPokemonData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [apiUrl]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastPokemon = currentPage * itemsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
  const currentPokemonData = filteredData.slice(indexOfFirstPokemon, indexOfLastPokemon);
  const displayedData = showAll ? filteredData : currentPokemonData;

  // フィルタ処理
  const filterPokemons = () => {
    let temp = [...pokemonData];

    // 1) 名前検索
    if (searchTerm.trim() !== '') {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2) タイプ絞り込み（react-select で取得したオブジェクトを利用）
    temp = applyTypeFilter(temp, selectedType1, selectedType2);
    return temp;
  };

  // 検索実行
  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const result = filterPokemons();
      setFilteredData(result);
      setCurrentPage(1);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleShowAll = () => {
    setIsLoadingAll(true);
    setTimeout(() => {
      setShowAll(!showAll);
      setIsLoadingAll(false);
    }, 500);
  };

  // ステータス計算関数
  const calculateHpMin = (base) => Math.floor(((2 * base + 31 + 0) * 50) / 100) + 50 + 10;
  const calculateHpMax = (base) => Math.floor(((2 * base + 31 + (252 / 4)) * 50) / 100) + 50 + 10;
  const calculateStatMin = (base) => {
    const tmp = Math.floor(((2 * base + 31 + 0) * 50) / 100) + 5;
    return Math.floor(tmp * 1.0);
  };
  const calculateStatMax = (base) => {
    const tmp = Math.floor(((2 * base + 31 + (252 / 4)) * 50) / 100) + 5;
    return Math.floor(tmp * 1.1);
  };

  if (loading || isLoadingAll || isSearching) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const createStatsArray = (pkm) => [
    { label: 'HP',     base: pkm.base_h, isHp: true  },
    { label: '攻撃',   base: pkm.base_a, isHp: false },
    { label: '防御',   base: pkm.base_b, isHp: false },
    { label: '特攻',   base: pkm.base_c, isHp: false },
    { label: '特防',   base: pkm.base_d, isHp: false },
    { label: '素早さ', base: pkm.base_s, isHp: false },
  ];

  return (
    <Box p="6">
      {/* 上部エリア */}
      <Flex mb="8" align="center" gap={4}>
        <IconButton
          icon={<FaMapMarkedAlt />}
          aria-label="API エンドポイントを選択"
          onClick={openEndpointModal}
          colorScheme={isEndpointModalOpen ? 'blue' : 'gray'} 
        />
        <LinksModal />
        <Input
          placeholder="ポケモン名を入力"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          width="300px"
        />
        {/* react-select を利用したタイプ検索 */}
        <Box bg="gray.100" p={3} borderRadius="md">
          <Flex align="center" gap={3}>
            <ReactSelect
              value={selectedType1}
              onChange={(option) => setSelectedType1(option)}
              options={typeOptionsReact}
              styles={selectCustomStyles}
              isSearchable={false}
            />
            <ReactSelect
              value={selectedType2}
              onChange={(option) => setSelectedType2(option)}
              options={typeOptionsReact}
              styles={selectCustomStyles}
              isSearchable={false}
            />
            <IconButton
              aria-label="検索"
              icon={<FaSearch />}
              onClick={handleSearch}
              colorScheme="blue"
            />
          </Flex>
        </Box>
        <IconButton
          aria-label="設定"
          icon={<FaCog />}
          onClick={() => setShowActualStats(!showActualStats)}
          colorScheme={showActualStats ? 'blue' : 'gray'}
          ml="auto"
        />
        <IconButton
          aria-label="計算式の説明"
          icon={<FaExclamationCircle />}
          onClick={() => setIsExplanationOpen(true)}
          colorScheme={isExplanationOpen ? 'blue' : 'gray'}
        />
        <IconButton
          aria-label="すべて表示"
          icon={<FaInfinity />}
          onClick={toggleShowAll}
          colorScheme={showAll ? 'blue' : 'gray'}
        />
      </Flex>

      {/* (5) エンドポイント選択モーダル */}
      <Modal isOpen={isEndpointModalOpen} onClose={closeEndpointModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>バージョン一覧</ModalHeader>
          <ModalCloseButton />
          <ModalBody my="6">
            <VStack spacing={6} align="stretch">
              {endpoints.map((endpoint) => (
                <Button
                  key={endpoint.label}
                  onClick={() => {
                    setApiUrl(endpoint.url);
                    closeEndpointModal();
                  }}
                >
                  {endpoint.label}
                </Button>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* (6) 計算式の説明モーダル */}
      <Modal isOpen={isExplanationOpen} onClose={() => setIsExplanationOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent px="0" py="12">
          <ModalHeader textAlign="center">ステータス計算の説明</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              <Box
                as="span"
                border="1px solid gray"
                borderRadius="md"
                px="2"
                py="1"
                bg="gray.100"
                fontWeight="bold"
                display="block"
                mb="2"
                mx="-2"
              >
                HP<br />
                努力値0 & 性格×1.0 ～ 努力値252 & 性格×1.0
              </Box>
              <Box>
                <strong>MAX</strong><br />
                ((2 × 種族値 + 31 + (252/4)) × 50 / 100) + 50 + 10 <br />
                <br />
                <strong>MIN</strong><br />
                ((2 × 種族値 + 31 + (0/4)) × 50 / 100) + 50 + 10
              </Box>
            </Text>
            <Text mt={10}>
              <Box
                as="span"
                border="1px solid gray"
                borderRadius="md"
                px="2"
                py="1"
                bg="gray.100"
                fontWeight="bold"
                display="block"
                mb="6"
              >
                A, B, C, D, S<br />
                （努力値0 or 252, 性格1.0 or 1.1）
              </Box>
              <Box px="4" mx="-2">
                <strong>MAX</strong><br />
                &#123;(((2 × 種族値 + 31 + (252/4)) × 50 / 100) + 5) × 1.1&#125; <br />
                <br />
                <strong>MIN</strong><br />
                &#123;(((2 × 種族値 + 31 + (0/4)) × 50 / 100) + 5) × 1.0&#125;
              </Box>
            </Text>
          </ModalBody>
          <ModalFooter my="1">
            <Button colorScheme="blue" onClick={() => setIsExplanationOpen(false)}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 現在のエンドポイント表示 */}
      <Text fontWeight="bold" fontSize="3xl" align="center">
        {getRegionName(apiUrl)}
      </Text>

      {/* ページネーション（すべて表示時は非表示） */}
      {!showAll && (
        <Flex mt="10" mb="6" flexDirection="column" align="center">
          <Flex>
            <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              前へ
            </Button>
            <Text mx="12" mt="5">
              {currentPage} / {totalPages}
            </Text>
            <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              次へ
            </Button>
          </Flex>
        </Flex>
      )}

      {/* ポケモンカード一覧 */}
      <Flex wrap="wrap" justify="flex-start" gap="6">
        {displayedData.map((pokemon) => {
          const stats = createStatsArray(pokemon);
          return (
            <Box
              key={pokemon.unique_id}
              bg="white"
              p="4"
              borderRadius="md"
              shadow="md"
              border="1px"
              borderColor="gray.200"
              width="20%"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              justify="between-space"
              alignItems="center"
            >
              <Box
                width="100%"
                height="50px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={3}
              >
                <Text fontSize="lg" fontWeight="bold" color="teal.800" whiteSpace="nowrap">
                  {pokemon.name}
                </Text>
              </Box>
              <Table variant="simple" my="6" width="100%" tableLayout="fixed">
                <Tbody>
                  <Tr bg="blue.100">
                    <Td textAlign="center" p="0.5" width="50%">タイプ</Td>
                    <Td textAlign="center" p="1" width="50%">
                      {pokemon.TYPE01} {pokemon.TYPE02 && ` ・ ${pokemon.TYPE02}`}
                    </Td>
                  </Tr>
                  {stats.map(({ label, base, isHp }, index) => {
                    let displayValue;
                    if (!showActualStats) {
                      displayValue = base;
                    } else {
                      displayValue = isHp
                        ? `${calculateHpMin(base)}〜${calculateHpMax(base)}`
                        : `${calculateStatMin(base)}〜${calculateStatMax(base)}`;
                    }
                    return (
                      <Tr key={label} bg={index % 2 === 0 ? "gray.100" : "gray.200"}>
                        <Td textAlign="center" p="1" width="50%">{label}</Td>
                        <Td textAlign="center" p="1" width="50%">{displayValue}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default PokemonList;
