// src/components/PokemonCards/UI/PokemonCard.tsx
import React from "react";
import { PokemonDetail } from "@/PokemonCards01/types/types";
import PokemonImage from "../components/Card/PokemonImage";
import PokemonName from "../components/Card/PokemonName";
import PokemonTypes from "../components/Card/PokemonTypes";
import PokemonStats from "../components/Card/PokemonStats";
import { MdChangeCircle } from "react-icons/md";

interface Props {
  readonly pokemon: PokemonDetail;
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
      {/*
        名前表示:
        - 以前は単一の文字列（pokemon.name）でしたが、API 形式変更により
          names オブジェクトに変更。
        ※ PokemonName コンポーネントも names オブジェクトを受け取るように修正済みと仮定
      */}
      <PokemonName names={pokemon.names} />
      
      {/*
        画像表示:
        - pokemon.images.frontImage または frontUrl を使用（どちらか利用可能な方）
      */}
      <PokemonImage
        imageUrl={pokemon.images.frontImage || pokemon.images.frontUrl || ""}
        alt={pokemon.names.en}
      />
      
      {/*
        タイプ表示:
        - API ではタイプ情報が配列 (pokemon.type_) に格納されるため、
          PokemonTypes コンポーネントもそれに合わせて、props を types として受け取るように修正
      */}
      <PokemonTypes types={pokemon.type_} />
      
      {/*
        ステータス表示:
        - PokemonStats コンポーネントは、API の新形式 (pokemon.stats) に合わせて修正済みとする
      */}
      <PokemonStats pokemon={pokemon} showActualStats={showActualStats} />
    </div>
  );
};

export default PokemonCard;
