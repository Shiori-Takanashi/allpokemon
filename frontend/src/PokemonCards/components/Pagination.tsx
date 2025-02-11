// src/components/PokemonCards/ui/Pagination.tsx
import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPrev, onNext }) => {
  return (
    <div className="pagination-container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          style={{
            padding: "4px 8px",
            marginRight: "16px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            backgroundColor: currentPage === 1 ? "#ccc" : "blue",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          前へ
        </button>

        <span style={{ margin: "0 12px" }}>
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          style={{
            padding: "4px 8px",
            marginLeft: "16px",
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
