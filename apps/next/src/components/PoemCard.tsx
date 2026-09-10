"use client";

import { Box, Card, CardActionArea, CardContent, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { KimarijiText } from "./KimarijiText";
import { RubyText } from "./RubyText";

type Props = {
  number: number;
  kami: string;
  shimo: string;
  kamiKana: string;
  shimoKana: string;
  kimariji: string;
  author: string;
  authorKana?: string | null;
  /** カードをクリックしたときの移動先 */
  href: string;
  isFavorite: boolean;
  favoritePending?: boolean;
  onToggleFavorite: () => void;
};

/**
 * 一覧画面とお気に入り画面で使う、歌1首ぶんのカード。
 *
 * 2つの画面でまったく同じ見た目を作っていたので、1つの部品にまとめた。
 * こうしておくと、デザインを直すときに1か所だけ直せばよい。
 */
export function PoemCard({
  number,
  kami,
  shimo,
  kamiKana,
  shimoKana,
  kimariji,
  author,
  authorKana,
  href,
  isFavorite,
  favoritePending,
  onToggleFavorite,
}: Props) {
  return (
    // ♡ ボタンをカード内に重ねて置くため position: relative にする
    <Card
      sx={{
        position: "relative",
        // マウスを乗せたとき、枠を朱色にしてうっすら浮かせる
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <CardActionArea component={Link} href={href}>
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
            第{number}首
          </Typography>

          <Typography variant="h3" sx={{ mb: 0.5 }}>
            <RubyText text={kami} reading={kamiKana} />
          </Typography>
          <Typography variant="h3" sx={{ mb: 2 }}>
            <RubyText text={shimo} reading={shimoKana} />
          </Typography>

          {/* 決まり字だけ赤くしたかな表記（仕様7章） */}
          <Typography variant="body1" sx={{ mb: 2.5 }}>
            <KimarijiText text={kamiKana} kimariji={kimariji} />
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack direction="row" spacing={4}>
            <Typography variant="body2">
              <Box component="span" sx={{ color: "text.secondary" }}>
                決まり字：
              </Box>
              {kimariji}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ color: "text.secondary" }}>
                作者：
              </Box>
              <RubyText text={author} reading={authorKana} />
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>

      {/*
        ♡ ボタンはカード全体のリンク（CardActionArea）の外に置く。
        リンクの中にボタンを入れると入れ子になり、
        押したときに詳細画面へ移動してしまうため。
      */}
      <Box sx={{ position: "absolute", top: 12, right: 12 }}>
        <FavoriteButton
          isFavorite={isFavorite}
          disabled={favoritePending}
          onToggle={onToggleFavorite}
        />
      </Box>
    </Card>
  );
}
