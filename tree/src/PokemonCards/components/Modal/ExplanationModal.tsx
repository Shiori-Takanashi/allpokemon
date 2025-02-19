// src/components/PokemonCards/parts/ExplanationModal.tsx
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ExplanationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          width: "600px",
          maxWidth: "80%",
          position: "relative",
        }}
      >
        <h2
          style={{
            marginTop: 12,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          ステータス計算の説明
        </h2>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "8px",
            right: "16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
          title="閉じる"
        >
          &times;
        </button>

        <div style={{ marginTop: "16px", lineHeight: 1.6 }}>
          <div
            style={{
              border: "1px solid gray",
              borderRadius: "4px",
              padding: "8px",
              backgroundColor: "#f9f9f9",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            HP の計算式例
            <br />
            努力値 0 & 性格 ×1.0 ～ 努力値 252 & 性格 ×1.0
          </div>
          <p style={{ marginLeft: "12px" }}>
            <strong>MAX</strong>
            <br />
            ((2 × 種族値 + 31 + (252/4)) × 50 / 100) + 50 + 10
            <br />
            <br />
            <strong>MIN</strong>
            <br />
            ((2 × 種族値 + 31 + (0/4)) × 50 / 100) + 50 + 10
          </p>

          <div
            style={{
              border: "1px solid gray",
              borderRadius: "4px",
              padding: "8px",
              backgroundColor: "#f9f9f9",
              fontWeight: "bold",
              margin: "16px 0 6px 0",
            }}
          >
            A, B, C, D, S の計算式例
          </div>
          <p style={{ marginLeft: "12px" }}>
            <strong>MAX</strong>
            <br />
            &#123;(((2 × 種族値 + 31 + (252/4)) × 50 / 100) + 5) × 1.1&#125;
            <br />
            <br />
            <strong>MIN</strong>
            <br />
            &#123;(((2 × 種族値 + 31 + (0/4)) × 50 / 100) + 5) × 1.0&#125;
          </p>
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px 12px",
              backgroundColor: "blue",
              color: "#fff",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
