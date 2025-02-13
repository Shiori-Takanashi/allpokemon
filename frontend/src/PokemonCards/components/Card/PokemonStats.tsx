import React from "react";
import { Pokemon } from "@/PokemonCards/logics/fetchPokemons";
import {
  calculateHpMin,
  calculateHpMax,
  calculateStatMin,
  calculateStatMax,
} from "@/PokemonCards/logics/calcStats";
import "../../style/PokemonStats.css"

// 型定義
interface Props {
  readonly pokemon: Pokemon;
  readonly showActualStats: boolean;
}

const PokemonStats: React.FC<Props> = ({ pokemon, showActualStats }) => {
  const statsArray = [
    { label: "H", base: pokemon.base_h, isHp: true },
    { label: "A", base: pokemon.base_a, isHp: false },
    { label: "B", base: pokemon.base_b, isHp: false },
    { label: "C", base: pokemon.base_c, isHp: false },
    { label: "D", base: pokemon.base_d, isHp: false },
    { label: "S", base: pokemon.base_s, isHp: false },
    { label: "T", base: pokemon.base_t, isHp: false },
  ];

  return (
    <table className="pokemon-stats-table">
      <tbody>
        {statsArray.map(({ label, base, isHp }, index) => {
          const displayValue = showActualStats
            ? isHp
              ? `${calculateHpMin(base)}〜${calculateHpMax(base)}`
              : `${calculateStatMin(base)}〜${calculateStatMax(base)}`
            : String(base);

          return (
            <tr key={label} className={index % 2 === 0 ? "pokemon-stats-row-even" : "pokemon-stats-row-odd"}>
              <td className="pokemon-stats-label">{label}</td>
              <td className="pokemon-stats-value">{displayValue}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PokemonStats;
