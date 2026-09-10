import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

/**
 * 「今日の一首」「学習状況」などの見出し。
 *
 * 左に朱色の縦線を引いて、和風の区切りらしく見せている。
 * 全画面で同じ部品を使うことで、見出しの大きさ・余白がそろう。
 */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="h3"
      sx={{
        mb: 2.5,
        pl: 2,
        borderLeft: 3,
        borderColor: "primary.main",
        lineHeight: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}
