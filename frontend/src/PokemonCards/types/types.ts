"use client";

/** react-select などで使うラベル・値ペア */
export interface SelectOption {
  value: string;
  label: string;
}
export type OptionType = SelectOption;

/** フィルタに使用する1スロット分の状態 */
export interface Status {
  selectedStat: SelectOption;       // 例: 「HP」「攻撃」「---」など
  selectedOperator: SelectOption;   // 例: 「以上」「以下」「---」など
  value: string;                    // 数値
}

/** ポケモン1体分の詳細情報 */
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
    frontShinyUrl: string | null;
  };
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

/** ページネーション付きのレスポンス */
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonDetail[];
}

/** ページネーション用コンポーネントのプロパティ */
export interface PaginationControlsProps {
  totalCount: number;
  limit: number;
  offset: number;
  onOffsetChange: (newOffset: number) => void;
}

/** フィルタ実行用コンポーネントのプロパティ */
export interface ShowStatusesProps {
  statuses: Status[];
  onFilter: () => void;
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
  /** React-Select の SSR ID 不整合を防ぐためのID (任意) */
  instanceId?: string;
}

/** 以下、フィルター処理用の追加型定義 */

// 警告トーストを表示するための関数の型
export type ShowToastWarning = (options: { description: string }) => void;

// ページネーションのオフセットを設定する関数の型
export type SetOffset = (offset: number) => void;

// データ取得を行う関数の型
export type FetchData = (offset: number, showToast: boolean) => void;

/**
 * フィルター処理を行う関数
 *  - statuses 内の selectedStat.value を元に重複チェックを行い、
 *    同じステータスが複数ある場合は警告を表示して処理中断。
 *  - 問題なければページをリセットし、新しいデータを取得する。
 */
export const handleFilter = (
  statuses: Status[],
  showToastWarning: ShowToastWarning,
  setOffset: SetOffset,
  fetchData: FetchData
): void => {
  const map: Record<string, number> = {};

  for (const st of statuses) {
    const key: string = st.selectedStat.value;

    if (key !== "none" && key !== "") {
      map[key] = (map[key] || 0) + 1;

      if (map[key] > 1) {
        showToastWarning({
          description: "同じステータスに複数の条件があります。\nフィルターを実行しません。"
        });
        return;
      }
    }
  }

  setOffset(0);
  fetchData(0, true);
};
