// サーバーコンポーネントでは `@mui/material` からまとめて import せず、
// 部品ごとのパスから import する。まとめて import すると、このMUI(v9)では
// クライアント専用の useMediaQuery まで読み込まれてサーバー側でエラーになる。
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { TatamiBackground } from "@/components/TatamiBackground";
import { IVORY } from "@/colors";

/**
 * かるた道場（開発用プロジェクト名: chihaya）の共通レイアウト。
 *
 * フォルダ名を (chihaya) のように括弧で囲むと「ルートグループ」になり、
 * URL には含まれない。つまり (chihaya)/poems/page.tsx は /poems で表示される。
 * これにより、既存のオンボーディング課題ページ (/onboarding/...) には
 * このヘッダーやテーマを適用せず、chihaya のページだけをまとめられる。
 *
 * 画面の重ね順は次のとおり。
 *   背景（畳）  ← TatamiBackground: position: fixed で画面に固定
 *   その上に本文 ← position: relative + zIndex: 1 で畳より前面に置く
 */
export default function ChihayaLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <TatamiBackground />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* 畳の上に和紙を敷くイメージ。文字を読みやすくするための土台 */}
          <Box
            sx={{
              backgroundColor: IVORY,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              px: { xs: 3, md: 6 },
              py: { xs: 4, md: 6 },
              minHeight: "60vh",
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>
    </Providers>
  );
}
