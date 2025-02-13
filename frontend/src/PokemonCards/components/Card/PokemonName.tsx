import React from "react";

interface Props {
  readonly name: string;
}

const PokemonName: React.FC<Props> = ({ name }) => {
  const index = name.indexOf("(");

  return (
    // JSX: 名前全体のコンテナ
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column", // 縦方向に並べる
        marginTop: "10%"
      }}
    >
      {index > 0 ? (
        <>
          {/* メインの名前 */}
          <div className="pokemon-main-name">{name.substring(0, index)}</div>

          {/* サブの名前（カッコ内） */}
          <div className="pokemon-sub-name">{name.substring(index)}</div>
        </>
      ) : (
        <>
          <div className="pokemon-main-name">{name}</div>
          <div className="pokemon-sub-name">　</div>
        </>
      )}
    </div>
  );
};

export default PokemonName;
