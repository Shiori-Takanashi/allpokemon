// src/components/PokemonCards/parts/EndpointsModal.tsx
import React from "react";
import { Endpoint } from "@/PokemonCards/hooks/usePokemonCards";

interface EndpointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoints: Endpoint[];
  setApiUrl: React.Dispatch<React.SetStateAction<string>>;
}

const EndpointsModal: React.FC<EndpointsModalProps> = ({
  isOpen,
  onClose,
  endpoints,
  setApiUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
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
          width: "300px",
          height: "600px",
          maxWidth: "90%",
          position: "relative",
        }}
      >
        <h2 style={{ marginTop: 0 }}>バージョン一覧</h2>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "8px",
            right: "16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "32px",
          }}
        >
          &times;
        </button>
        <div style={{ marginTop: "20px" }}>
          {endpoints.map((endpoint) => (
            <button
              key={endpoint.label}
              onClick={() => {
                setApiUrl(endpoint.url);
                onClose();
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                padding: "6px",
                cursor: "pointer",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              {endpoint.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EndpointsModal;
