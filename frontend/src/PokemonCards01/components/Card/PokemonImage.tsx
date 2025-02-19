import React from "react";
import usePokemonImgFetch from "@/PokemonCards01/hooks/usePokemonImgFetch";
import { MdImageNotSupported } from "react-icons/md";
import "../../style/PokemonImage.css";

interface Props {
  readonly imageUrl: string;
  readonly alt: string;
}

const PokemonImage: React.FC<Props> = ({ imageUrl, alt }) => {
  // API変更により、imageUrl が falsy の場合はすぐにフォールバックを表示する
  if (!imageUrl) {
    return (
      <div className="pokemon-image-container">
        <MdImageNotSupported className="non-pokemon-image-icon" />
      </div>
    );
  }

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
  ) : (
    // 画像データがない場合もフォールバックを表示
    <div className="pokemon-image-container">
      <MdImageNotSupported className="non-pokemon-image-icon" />
    </div>
  );
};

export default PokemonImage;
