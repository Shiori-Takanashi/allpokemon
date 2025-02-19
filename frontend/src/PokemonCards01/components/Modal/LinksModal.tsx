// src/PokemonCards/components/LinksModal.tsx
import React from "react";
import "../../style/LinksModal.css";

// Props の型定義
// isOpen: モーダル表示状態（true の場合に表示）
// onClose: モーダルを閉じる際に呼ばれる関数
interface LinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LinksModal コンポーネント
 * -----------------------------------------------------------
 * このモーダルは、関連リンクを一覧表示します。
 * ・isOpen が true の場合に表示されます。
 * ・onClose() を実行することでモーダルを閉じます。
 * ・内部にタイトル、リンク一覧、閉じるボタンが含まれます。
 * -----------------------------------------------------------
 */
const LinksModal: React.FC<LinksModalProps> = ({ isOpen, onClose }) => {
  // モーダルが非表示の場合、何もレンダリングせず null を返す
  // ※ 注意：ここで返している null は、JavaScript/TypeScript で「何も返さない」状態を示す値です。
  //     Python では同様の概念に None が使われますが、TypeScript では null を用います。
  if (!isOpen) return null;

  return (
    // オーバーレイ：画面全体を覆い、半透明の背景でモーダルを中央に配置
    <div className="links-modal-overlay">
      {/*
        モーダルコンテンツエリア：
        - 白い背景にパディングと角丸が適用されたボックスです。
        - position: relative により、内部の絶対配置要素（閉じるボタンなど）が配置可能です。
        - width: 400px、max-width: 90%、max-height: 80vh により、
          画面サイズに応じてサイズが自動調整され、内容が多い場合はスクロール可能です。
      */}
      <div className="links-modal-content">
        {/*
          閉じるボタン：
          - 右上に絶対配置され、クリックすると onClose() を実行してモーダルを閉じます。
          - "&times;" は一般的な「閉じる」記号として機能し、HTML エンティティとして「×」が表示されます。
        */}
        <button
          onClick={onClose}
          className="links-modal-close-button"
        >
          &times;
        </button>

        {/*
          ヘッダー：
          - モーダルのタイトル「関連リンク」を表示します。
          - "links-modal-heading" クラスにより上下の余白が設定されています。
        */}
        <h2 className="links-modal-heading">関連リンク</h2>

        {/*
          リンク一覧コンテナ：
          - 各リンクは段落 (<p>) で囲まれ、上下にパディングが適用されています。
          - リンク自体は "links-modal-link" クラスにより青色で表示されます。
        */}
        <div className="links-modal-link-container">
          <p>
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="links-modal-link"
            >
              Example サイト
            </a>
          </p>
          <p>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="links-modal-link"
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
