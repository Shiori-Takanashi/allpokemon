import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  totalCount: number; // ← 総件数用のプロパティを追加
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, totalCount, onPrev, onNext }) => {
  return (
    <div className="pagination-container" style={{ textAlign: "center" }}>
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

export default Pagination;
