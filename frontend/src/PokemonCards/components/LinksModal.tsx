// src/components/PokemonCards/parts/LinksModal.tsx
import React, { useState } from "react";
import { FaLink } from "react-icons/fa";

const LinksModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          marginRight: "200px",
        }}
        title="リンク一覧を表示"
      >
        <FaLink size={20} color={isOpen ? "blue" : "black"} />
      </button>

      {isOpen && (
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
              onClick={() => setIsOpen(false)}
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
            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button
                onClick={() => setIsOpen(false)}
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
      )}
    </>
  );
};

export default LinksModal;
