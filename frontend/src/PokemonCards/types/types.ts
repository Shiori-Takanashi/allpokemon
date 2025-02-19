// src/PokemonCards/types/types.ts

/** react-select などで使うラベル・値ペア */
export interface SelectOption {
    value: string;
    label: string;
  }
  
  export type OptionType = SelectOption;
  
  /** フィルタに使用する1スロット分の状態 */
  export interface Status {
    selectedStat: SelectOption;       // "HP","攻撃","---"など
    selectedOperator: SelectOption;   // "以上","以下","---"など
    value: string;                    // 数値
  }
  
  /** ポケモン1体分の情報 */
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
    // 必要に応じて他の項目も追加
  }
  
  /** ページネーション付きレスポンス */
  export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonDetail[];
  }
  
  /** 検索ページに渡すプロパティ */
  export interface SearchPageProps {
    // 追加したい場合はここに
  }
  
  /** ページネーション用コンポーネントのプロパティ */
  export interface PaginationControlsProps {
    totalCount: number;       // 検索結果の総件数
    limit: number;            // 1ページあたりの件数(48)
    offset: number;           // 現在の offset
    onOffsetChange: (newOffset: number) => void;
  }
  
  /** フィルタ実行用コンポーネントのプロパティ */
  export interface ShowStatusesProps {
    statuses: Status[];
    onFilter: () => void;  // フィルターを実行する（親のfetchを呼ぶ）コールバック
  }
  
  /** StatusGroup のプロパティ */
  export interface StatusGroupProps {
    statuses: Status[];
    setStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
  }
  
  /** StatusSetters のプロパティ */
  export interface StatusSettersProps {
    statuses: Status[];
    updateStatus: (index: number, newStatus: Partial<Status>) => void;
  }
  
  /** StatusSetter のプロパティ */
  export interface StatusSetterProps {
    selectedStat: SelectOption;
    setSelectedStat: (option: SelectOption) => void;
    selectedOperator: SelectOption;
    setSelectedOperator: (option: SelectOption) => void;
    value: string;
    setValue: (val: string) => void;
  }
  