// types/types.ts
export interface SelectOption {
  value: string;
  label: string;
}

export type OptionType = SelectOption;

export interface Status {
  selectedStat: SelectOption;
  selectedOperator: SelectOption;
  value: string;
}

// ポケモン1体分
export interface PokemonDetail {
  ids: {
    unique_id: string;
  };
  names: {
    ja: string;
  };
  images: {
    frontUrl: string | null;
    frontImage: string | null;
  };
  type_: string[];
  // ...必要に応じて他のプロパティも続く
}

// ポケモンリスト
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonDetail[];
}

// SearchPage に渡す props
export interface SearchPageProps {
  searchData: PokemonListResponse | null;
}

// ShowStatuses に渡す props（拡張して setSearchData を受け取る想定）
export interface ShowStatusesProps {
  statuses: Status[];
  setSearchData: (data: PokemonListResponse | null) => void;
}

// StatusesGroup に渡す props
export interface StatusGroupProps {
  statuses: Status[];
  setStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
  setSearchData: (data: PokemonListResponse | null) => void;
}

// StatusSetter 単体の props
export interface StatusSetterProps {
  selectedStat: OptionType;
  setSelectedStat: (option: OptionType) => void;
  selectedOperator: OptionType;
  setSelectedOperator: (option: OptionType) => void;
  value: string;
  setValue: (value: string) => void;
}

export interface SearchDataDisplayProps {
  data: PokemonListResponse;
}