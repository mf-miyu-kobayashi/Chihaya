"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import type { ReactNode } from "react";
import { theme } from "@/theme";

/**
 * MUI のテーマをアプリ全体に配る部品。
 *
 * ThemeProvider は React の Context を使うため、ブラウザ側で動く
 * クライアントコンポーネントである必要がある。そのためファイル先頭に
 * "use client" を書いている。
 *
 * CssBaseline はブラウザごとに違う既定のスタイル（余白など）をリセットし、
 * テーマの背景色・文字色を body に適用してくれる。
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
