import React from "react";

interface NameProps {
  ja: string;
  en: string;
  subJa: string;
  subEn: string;
}

interface Props {
  readonly names?: NameProps;
  /** 表示言語。指定がない場合は "en" を使用 */
  readonly language?: "ja" | "en";
}

// 名前情報が存在しない場合のデフォルト値
const defaultNames: NameProps = {
  ja: "不明",
  en: "Unknown",
  subJa: "",
  subEn: "",
};

const PokemonName: React.FC<Props> = ({ names, language = "ja" }) => {
  // names が渡されなかった場合は defaultNames を使用
  const effectiveNames = names || defaultNames;
  // 指定された言語に基づいてメインの名前を取得
  const displayName = effectiveNames[language]?.trim() || defaultNames[language];
  
  // 名前が空の場合はプレースホルダーを表示
  if (!displayName) {
    return (
      <div className="pokemon-name-container" style={containerStyle}>
        <div className="pokemon-main-name">{defaultNames[language]}</div>
        <div className="pokemon-sub-name">&nbsp;</div>
      </div>
    );
  }

  // もし括弧で補足情報がある場合（例："Durant (アイアント)" など）、括弧の位置を検出
  const parenIndex = displayName.indexOf("(");
  const mainName =
    parenIndex > 0 ? displayName.substring(0, parenIndex).trim() : displayName;
  const subName =
    parenIndex > 0 ? displayName.substring(parenIndex).trim() : "";

  return (
    <div className="pokemon-name-container" style={containerStyle}>
      <div className="pokemon-main-name">{mainName}</div>
      <div className="pokemon-sub-name">{subName || "\u3000"}</div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  flexDirection: "column",
  marginTop: "10%",
};

export default PokemonName;
