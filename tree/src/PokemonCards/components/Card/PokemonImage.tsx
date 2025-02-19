import React from "react";
import usePokemonImgFetch from "../../hooks/usePokemonImgFetch";
import { MdImageNotSupported } from "react-icons/md";
import "../../style/PokemonImage.css";

// 型定義
interface Props {
    readonly imageUrl: string;
    readonly alt: string;
}

// PokemonImage.tsx
const PokemonImage: React.FC<Props> = ({ imageUrl, alt }) => {
  const { pokemonImg, loading, error } = usePokemonImgFetch(imageUrl);
  const [minLoadingElapsed, setMinLoadingElapsed] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setMinLoadingElapsed(true), 700);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="pokemon-image-container">
          <MdImageNotSupported className="non-pokemon-image-icon" />
      </div>
    );
  }

  if (loading || (!loading && !minLoadingElapsed)) {
    return (
      <div className="pokemon-image-container">
        <div className="pokemon-image-spinner" />
      </div>
    );
  }

  return pokemonImg ? (
    <div className="pokemon-image-container">
      <img src={pokemonImg.url} alt={alt} className="pokemon-image" />
    </div>
  ) : null;
};


export default PokemonImage;
