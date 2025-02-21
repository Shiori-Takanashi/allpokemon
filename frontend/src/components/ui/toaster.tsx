"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";

/**
 * 1) createToaster の設定
 *   - placement を "top" にすることでトーストが上部に表示される
 *   - offsets で上端から少し下げ、左右を程よく余白
 *   - pauseOnPageIdle は必要に応じて設定
 */
export const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
  offsets: { left: "20px", top: "20px", right: "20px", bottom: "20px" },
});

/**
 * 2) 共通トースト呼び出し関数
 *   - status は使わず、type のみで区別
 */
export const showToastSuccess = (params: { title?: string; description: string }) => {
  toaster.create({
    title: params.title ?? "成功",
    description: params.description,
    type: "info", // Chakra UI の "success" 的役割
    meta: { closable: true }, // 閉じるボタンの表示を常に許可
    duration: 3000
  });
};

export const showToastError = (params: { title?: string; description: string }) => {
  toaster.create({
    title: params.title ?? "エラー",
    description: params.description,
    type: "error",
    meta: { closable: true },
    duration: 3000
  });
};

export const showToastWarning = (params: { title?: string; description: string }) => {
  toaster.create({
    title: params.title ?? "警告",
    description: params.description,
    type: "warning",
    meta: { closable: true },
    duration: 3000
  });
};

/**
 * 3) トースター本体コンポーネント
 *   - すべてのトーストが上部に表示され、閉じるボタンを表示
 *   - テキスト量に応じて高さが変化するようにしつつ、幅は固定で統一
 *   - トランジションで上からスライドインするように CSS アニメーションを適用
 */
export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            // 全てのトーストが同じ幅をとるよう固定
            // テキスト量に合わせて高さが変わる（折り返し）形にする
            style={{
              position: "relative",
              width: "400px",        // ★固定幅で統一
              margin: "0 auto",      // 横中央揃え (placementがtopなので水平は自動調整されるが念のため)
              zIndex: 9999,
              // スライドダウン風のアニメーション
              animation: "slideDown 0.3s ease forwards",
            }}
          >
            {/* ローディング用の表示かインジケーターかを切り替え */}
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {/* ここで常に閉じるボタンを表示する */}
            <Toast.CloseTrigger style={{ marginRight: "8px", cursor: "pointer", fontSize: "24px" }}>
              ×
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </ChakraToaster>
      {/* 
        Toast.Root 内で使用したアニメーションを定義するための
        @keyframes をグローバルCSSとして書き込む場合の例。
        プロジェクト構成により globals.css 等に記載してください。
      */}
      <style jsx global>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Portal>
  );
};
