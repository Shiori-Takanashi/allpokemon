// src/PokemonCards/components/LinksModal.tsx (例)

import React from "react";

interface LinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 他のモーダルと同じ形式:
 *  - isOpen が true なら表示
 *  - onClose() で閉じる
 */
const LinksModal: React.FC<LinksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // false なら描画しない

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
          padding: "16px",
          borderRadius: "8px",
          width: "400px",
          maxWidth: "90%",
          position: "relative",
        }}
      >
        <h2 style={{ marginTop: "12px", marginBottom: "24px" }}>関連リンク</h2>
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
        >
          &times;
        </button>

        <div>
          <p style={{ margin: 0, padding: "8px 0" }}>
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              Example サイト
            </a>
          </p>
          <p style={{ margin: 0, padding: "8px 0" }}>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              Google
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinksModal;
