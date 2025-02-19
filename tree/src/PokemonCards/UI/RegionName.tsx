// src/PokemonCards/components/Title/RegionName.tsx

import React from "react";

// ==================== 型定義 ==================== //

/**
 * RagionName コンポーネントのプロパティ型
 * - regionName: 表示する地域名
 */
interface Props {
  readonly regionName: string;
}


// ==================== メインコンポーネント ==================== //

/**
 * RagionName コンポーネント（関数）
 * 
 * 地域名を大きく表示するためのコンポーネントです。
 */
const RagionName: React.FC<Props> = ({ regionName }) => {
  return (
    // JSX: 地域名表示用の <h2> 要素
    <h2
      style={{
        // スタイル: フォントを bold に設定
        fontWeight: "bold",
        // スタイル: フォントサイズを 30px に設定
        fontSize: "30px",
        // スタイル: テキストを中央揃えに設定
        textAlign: "center",
        // スタイル: 外側の余白を 36px に設定
        margin: 36,
      }}
    >
      {regionName}
    </h2>
  );
};

export default RagionName;
