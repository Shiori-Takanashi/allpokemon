// src/components/PokemonCards/parts/EndpointsModal.tsx

// ==================== インポート ==================== //
// Reactと必要な型、フック、その他の依存をインポートする
import React from "react";
import { Endpoint } from "@/PokemonCards01/hooks/usePokemonFetch";

// ==================== 型定義 ==================== //

/** 
 * EndpointsModal のプロパティ型
 * - isOpen: モーダルを表示するかどうかの真偽値
 * - onClose: モーダルを閉じるための関数
 * - endpoints: 利用可能なエンドポイントの配列
 * - setApiUrl: API URL を設定するための関数
 */
interface EndpointsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly endpoints: Endpoint[];
  readonly setApiUrl: React.Dispatch<React.SetStateAction<string>>;
}

// ==================== 関数 ==================== //

/** 
 * EndpointsModal コンポーネント（関数）
 * Context から取得した状態に基づき、各エンドポイントのボタンを表示するモーダルをレンダリングする
 */
const EndpointsModal: React.FC<EndpointsModalProps> = ({
  isOpen,
  onClose,
  endpoints,
  setApiUrl,
}) => {
  // モーダルが開いていない場合、何もレンダリングせずに null を返す
  if (!isOpen) return null;

  return (
    // JSX: モーダル全体のコンテナ
    <div
      style={{
        position: "fixed",               // 画面に固定表示
        inset: 0,                        // 全画面を覆う
        backgroundColor: "rgba(0,0,0,0.5)", // 背景は半透明の黒
        display: "flex",                 // Flexbox レイアウトで中央に配置
        justifyContent: "center",        // 水平方向中央揃え
        alignItems: "center",            // 垂直方向中央揃え
        zIndex: 999,                     // 最前面に表示
      }}
    >
      {/* JSX: モーダルウィンドウ（内部コンテナ） */}
      <div
        style={{
          background: "#fff",             // 背景色は白
          padding: "24px",                // 内側の余白を24pxに設定
          borderRadius: "8px",            // 角を8pxの半径で丸める
          width: "300px",                 // 固定幅300px
          height: "600px",                // 固定高さ600px
          maxWidth: "90%",                // 最大幅は画面幅の90%
          position: "relative",           // 内部で絶対配置を可能にする
        }}
      >
        {/* JSX: モーダルタイトル */}
        <h2 style={{ marginTop: 0 }}>バージョン一覧</h2>

        {/* JSX: モーダルを閉じるボタン */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",         // モーダル内の絶対位置に配置
            top: "8px",                   // 上から8px
            right: "16px",                // 右から16px
            background: "transparent",    // 背景は透明
            border: "none",               // 枠線なし
            cursor: "pointer",            // カーソルはポインター
            fontSize: "32px",             // フォントサイズ32px
          }}
        >
          &times;
        </button>

        {/* JSX: エンドポイントリストのコンテナ */}
        <div
          style={{
            marginTop: "20px",            // 上に20pxの余白
          }}
        >
          {/* JSX: 各エンドポイントのボタンをリスト表示 */}
          {endpoints.map((endpoint) => (
            <button
              key={endpoint.label}
              onClick={() => {
                setApiUrl(endpoint.url);
                onClose();
              }}
              style={{
                display: "flex",                   // ボタン内をFlexboxで整列
                justifyContent: "center",           // 中央揃え（水平方向）
                width: "100%",                      // 幅は100%
                padding: "6px",                     // 内側余白6px
                cursor: "pointer",                  // カーソルはポインター
                border: "1px solid #ccc",           // 薄いグレーの枠線
                borderRadius: "4px",                // 角を4pxで丸める
              }}
            >
              {/* JSX: エンドポイントのラベル */}
              {endpoint.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  ); // JSX
};

export default EndpointsModal;
