//// src/PokemonCards/UI/PokemonCard.tsx

import React from "react";
import { Pokemon } from "../logics/fetchPokemons";
import PokemonImage from "../components/Card/PokemonImage";
import PokemonName from "../components/Card/PokemonName";
import PokemonTypes from "../components/Card/PokemonTypes";
import PokemonStats from "../components/Card/PokemonStats";
import { MdChangeCircle } from "react-icons/md";

interface Props {
  readonly pokemon: Pokemon;
  readonly showActualStats: boolean;
}

const PokemonCard: React.FC<Props> = ({ pokemon, showActualStats }) => {
  return (
    <div 
      className="pokemon-card"
      style={{ position: "relative", padding: "0px" }}
    >
       <MdChangeCircle
        style={{
          position: "absolute",
          right: "-8px",
          top: "-3%",
          fontSize: "150%",
          cursor: "pointer",
          color: "#698ba9",
        }}
      />
      <PokemonName name={pokemon.name} />
      <PokemonImage imageUrl={pokemon.img} alt={pokemon.name} />
      <PokemonTypes type1={pokemon.TYPE01} type2={pokemon.TYPE02} />
      <PokemonStats pokemon={pokemon} showActualStats={showActualStats} />
    </div>
  );
};

export default PokemonCard;
