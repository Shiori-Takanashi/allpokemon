// src/PokemonCards/components/UI/TopPaginaion.tsx

import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  totalCount: number; // ← 総件数用のプロパティを追加
  onPrev: () => void;
  onNext: () => void;
  startIndex: number; // ページ範囲の開始インデックス
  endIndex: number; // ページ範囲の終了インデックス
  showAll: boolean; // 全件表示フラグ
}

const TopPagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  totalCount,
  onPrev,
  onNext,
  startIndex,
  endIndex,
  showAll,
}) => {
  return (
    <div className="pagination-container" style={{ textAlign: "center" }}>
      {/* Between コンポーネントの内容を直接挿入 */}
      <div
        style={{
          textAlign: "center",
          fontSize: "18px",
          marginBottom: "16px",
          color: "#555",
        }}
      >
        全 {totalCount} 匹
      </div>

      {/* 全件表示でない場合のみ、ページ範囲の表示 */}
      {!showAll && (
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            marginBottom: "16px",
            color: "#777",
          }}
        >
          {totalCount === 0 ? "0匹目" : `${startIndex}～${endIndex}匹目`}
        </div>
      )}

      {/* ページネーションのボタン */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          style={{
            padding: "4px 8px",
            marginRight: "24px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            backgroundColor: currentPage === 1 ? "#ccc" : "blue",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          前へ
        </button>
        <div style={{ fontSize: "18px", color: "#666" }}>
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          style={{
            padding: "4px 8px",
            marginLeft: "24px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            backgroundColor: currentPage === totalPages ? "#ccc" : "blue",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default TopPagination;
