// src/components/PokemonCards/types/types.ts

/** ページネーション付きレスポンス */
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonDetail[];
}

/** ポケモン1体分の情報 */
export interface PokemonDetail {
  original: boolean;
  ids: {
    unique_id: string;
    species_id: string;
    pokemon_id: string;
    form_id: string;
  };
  names: {
    ja: string;
    en: string;
    subJa: string;
    subEn: string;
  };
  images: {
    frontUrl: string | null;
    frontImage: string | null;
  };
  /** 新しいプロパティ: タイプは配列で返される */
  type_: string[];
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
    total: number;
  };
  exists_in_generations: number[];
  dex_numbers: {
    national: number;
    paldea: number | null;
    kitakami: number | null;
    blueberry: number | null;
  };
  json_files: {
    species: string;
    pokemon: string;
    form: string;
  };
}



/** react-select 用のオプション型 */
export interface SelectOption {
  value: string;
  label: string;
}
