// src/components/PokemonCards/components/Card/PokemonTypes.tsx
import React from "react";
import "@/PokemonCards01/style/PokemonTypes.css"

interface Props {
  types: string[];
}

const PokemonTypes: React.FC<Props> = ({ types = [] }) => {
  // types が空の場合でも map() を安全に使えるように、デフォルト値を [] に設定
  return (
    <div className="pokemon-types">
      {types.map((type, index) => (
        <span key={index} className={`pokemon-type ${type}`}>
          {type}
        </span>
      ))}
    </div>
  );
};

export default PokemonTypes;
