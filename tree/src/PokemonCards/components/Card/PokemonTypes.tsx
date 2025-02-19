import React from "react";
import "../../style/PokemonTypes.css"

interface Props {
  readonly type1: string;
  readonly type2?: string;
}

const PokemonTypes: React.FC<Props> = ({ type1, type2 }) => {
  return (
    <div className="pokemon-types">
      {[type1, type2].filter(Boolean).map((type, index) => (
        <div key={index} className="pokemon-type">{type}</div>
      ))}
    </div>
  );
};

export default PokemonTypes;
