// src/components/PokemonCards/parts/PokemonCards.tsx
import React from "react";
import { Pokemon } from "@/PokemonCards/logics/fetchPokemons";
import {
  calculateHpMin,
  calculateHpMax,
  calculateStatMin,
  calculateStatMax,
} from "@/PokemonCards/logics/calcStats";

interface Props {
  pokemons: Pokemon[];
  showActualStats: boolean;
}

const PokemonCards: React.FC<Props> = ({ pokemons, showActualStats }) => {
  return (
    <div className="pokemon-cards">
      {pokemons.map((pokemon) => {
        const statsArray = [
          { label: "HP", base: pokemon.base_h, isHp: true },
          { label: "攻撃", base: pokemon.base_a, isHp: false },
          { label: "防御", base: pokemon.base_b, isHp: false },
          { label: "特攻", base: pokemon.base_c, isHp: false },
          { label: "特防", base: pokemon.base_d, isHp: false },
          { label: "素早さ", base: pokemon.base_s, isHp: false },
        ];

        return (
          <div key={pokemon.unique_id} className="pokemon-card">
            <div
              style={{
                width: "100%",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <p className="pokemon-name">{pokemon.name}</p>
            </div>

            <div style={{ width: "100%", overflowX: "auto", marginTop: "12px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr style={{ backgroundColor: "#cce4ff" }}>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "4px",
                        width: "50%",
                        border: "1px solid #ccc",
                      }}
                    >
                      タイプ
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "4px",
                        width: "50%",
                        border: "1px solid #ccc",
                      }}
                    >
                      {pokemon.TYPE01}
                      {pokemon.TYPE02 && `・${pokemon.TYPE02}`}
                    </td>
                  </tr>
                  {statsArray.map(({ label, base, isHp }, index) => {
                    let displayValue = String(base);
                    if (showActualStats) {
                      if (isHp) {
                        displayValue = `${calculateHpMin(base)}〜${calculateHpMax(base)}`;
                      } else {
                        displayValue = `${calculateStatMin(base)}〜${calculateStatMax(base)}`;
                      }
                    }
                    return (
                      <tr
                        key={label}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#e0e0e0",
                        }}
                      >
                        <td
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            border: "1px solid #ccc",
                          }}
                        >
                          {label}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            border: "1px solid #ccc",
                          }}
                        >
                          {displayValue}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PokemonCards;
