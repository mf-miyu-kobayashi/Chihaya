"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** ヘッダーに並べるリンク。追加・変更はこの配列を直すだけでよい */
const NAV_ITEMS = [
  { label: "ホーム", href: "/" },
  { label: "百人一首", href: "/poems" },
  { label: "クイズ", href: "/quiz" },
  { label: "お気に入り", href: "/favorites" },
  { label: "履歴", href: "/history" },
];

export function Header() {
  // usePathname は「今どのURLを表示しているか」を返す Next.js のフック。
  // 現在地のリンクだけ色を変えるために使う。
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 4, px: { xs: 2, md: 6 }, minHeight: 72 }}>
        <Typography
          component={Link}
          href="/"
          variant="h3"
          sx={{ color: "primary.main", textDecoration: "none" }}
        >
          かるた道場
        </Typography>

        {/* flexGrow で残りの幅を埋め、リンクを右側に寄せる */}
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", gap: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                color: isActive(item.href) ? "primary.main" : "text.primary",
                fontWeight: isActive(item.href) ? 600 : 400,
                borderBottom: 2,
                borderRadius: 0,
                borderColor: isActive(item.href) ? "primary.main" : "transparent",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
