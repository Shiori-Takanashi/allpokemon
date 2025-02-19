// src/components/PokemonCards/UI/PokemonStats.tsx
import React from "react";
import { PokemonDetail } from "@/PokemonCards01/types/types";
import {
  calculateHpMin,
  calculateHpMax,
  calculateStatMin,
  calculateStatMax,
} from "../../logics/calcStats";
import "../../style/PokemonStats.css";

interface Props {
  readonly pokemon: PokemonDetail;
  readonly showActualStats: boolean;
}

interface Stat {
  label: string;
  base: number;
  isHp: boolean;
}

// 各ステータスの行を表示するコンポーネント
const StatRow: React.FC<{ stat: Stat; showActualStats: boolean }> = ({ stat, showActualStats }) => {
  const { label, base, isHp } = stat;
  const displayValue = showActualStats
    ? isHp
      ? `${calculateHpMin(base)}〜${calculateHpMax(base)}`
      : `${calculateStatMin(base)}〜${calculateStatMax(base)}`
    : String(base);

  return (
    <tr className={label === "H" ? "pokemon-stats-row-even" : "pokemon-stats-row-odd"}>
      <td className="pokemon-stats-label">{label}</td>
      <td className="pokemon-stats-value">{displayValue}</td>
    </tr>
  );
};

const PokemonStats: React.FC<Props> = ({ pokemon, showActualStats }) => {
  // stats オブジェクトを定義（stats は API の新しい形式に合わせ、pokemon.stats から取得）
  const stats: Stat[] = [
    { label: "H", base: pokemon.stats.hp, isHp: true },
    { label: "A", base: pokemon.stats.attack, isHp: false },
    { label: "B", base: pokemon.stats.defense, isHp: false },
    { label: "C", base: pokemon.stats.spAttack, isHp: false },
    { label: "D", base: pokemon.stats.spDefense, isHp: false },
    { label: "S", base: pokemon.stats.speed, isHp: false },
    // 「T」は合計値(total)として扱う場合
    { label: "T", base: pokemon.stats.total, isHp: false },
  ];

  return (
    <table className="pokemon-stats-table">
      <tbody>
        {stats.map((stat) => (
          <StatRow key={stat.label} stat={stat} showActualStats={showActualStats} />
        ))}
      </tbody>
    </table>
  );
};

export default PokemonStats;
