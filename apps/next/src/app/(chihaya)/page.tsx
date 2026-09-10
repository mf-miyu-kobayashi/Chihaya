"use client";

import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { KimarijiText } from "@/components/KimarijiText";
import { RubyText } from "@/components/RubyText";
import { SectionTitle } from "@/components/SectionTitle";
import { fetchFavorites } from "@/lib/favorites";
import { fetchPoems, type Poem } from "@/lib/poems";
import { fetchStatistics, type Statistics } from "@/lib/quizResults";

/** ④ メニュー（仕様8章）に並べるカード */
const MENU_ITEMS = [
  { label: "百人一首を見る", description: "100首を一覧・検索する", href: "/poems" },
  { label: "クイズに挑戦する", description: "10問4択で下の句を当てる", href: "/quiz" },
  { label: "お気に入りを見る", description: "登録した歌をまとめて見る", href: "/favorites" },
  { label: "学習履歴を見る", description: "正解率と苦手な歌を確認する", href: "/history" },
];

/**
 * その日の「今日の一首」を選ぶ。
 *
 * ランダムにすると画面を開くたびに変わってしまうので、
 * 日付から番号を計算する。同じ日なら何度開いても同じ歌になり、
 * 日付が変わると次の歌になる。
 */
function pickPoemOfTheDay(poems: Poem[]): Poem {
  const now = new Date();
  // 「西暦0年から数えた通算日数」のような値を作る（時刻は無視する）
  const days = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
  );
  // 100で割った余り（0〜99）を使って1首を選ぶ
  return poems[days % poems.length];
}

/** ホーム画面（URL: / ）。仕様8章 */
export default function HomePage() {
  const [poemOfTheDay, setPoemOfTheDay] = useState<Poem | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 今日の一首・学習統計・お気に入り数の3つをまとめて取得する
    Promise.all([fetchPoems(), fetchStatistics(), fetchFavorites()])
      .then(([poems, statistics, favorites]) => {
        setPoemOfTheDay(pickPoemOfTheDay(poems));
        setStats(statistics);
        setFavoriteCount(favorites.length);
      })
      .catch(() => setError("データを取得できませんでした。もう一度お試しください。"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      {/* ---- ① アプリタイトル ---- */}
      <Box sx={{ textAlign: "center", py: 4, mb: 5 }}>
        <Typography variant="h1" sx={{ color: "primary.main", mb: 2 }}>
          かるた道場
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          百人一首を、決まり字から。
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 5 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && poemOfTheDay && stats && (
        <Stack spacing={5} sx={{ mb: 5 }}>
          {/* ---- ② 今日の一首 ---- */}
          <Box>
            <SectionTitle>今日の一首</SectionTitle>
            <Card>
              <CardActionArea
                component={Link}
                href={`/poems/${poemOfTheDay.id}`}
              >
                <CardContent sx={{ textAlign: "center", py: 5 }}>
                  <Typography variant="h2" sx={{ mb: 1.5 }}>
                    <RubyText
                      text={poemOfTheDay.kami}
                      reading={poemOfTheDay.kami_kana}
                    />
                  </Typography>
                  <Typography variant="h2" sx={{ mb: 3 }}>
                    <RubyText
                      text={poemOfTheDay.shimo}
                      reading={poemOfTheDay.shimo_kana}
                    />
                  </Typography>

                  {/* 決まり字だけ赤くしたかな表記（仕様7章） */}
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    <KimarijiText
                      text={poemOfTheDay.kami_kana}
                      kimariji={poemOfTheDay.kimariji}
                    />
                  </Typography>

                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    <RubyText
                      text={poemOfTheDay.author}
                      reading={poemOfTheDay.author_kana}
                    />
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>

          {/* ---- ③ 学習状況 ---- */}
          <Box>
            <SectionTitle>学習状況</SectionTitle>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <StatRow label="回答数" value={`${stats.totalAnswers}問`} />
                  <Divider />
                  <StatRow label="正解数" value={`${stats.correctAnswers}問`} />
                  <Divider />
                  <StatRow label="正解率" value={`${stats.correctRate}%`} />
                  <Divider />
                  <StatRow label="お気に入り" value={`${favoriteCount}首`} />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      )}

      {/* ---- ④ メニュー ---- */}
      <SectionTitle>メニュー</SectionTitle>
      <Box
        sx={{
          display: "grid",
          // 2列に並べる。1列あたりの幅は均等（1fr = 余った幅を等分）
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        {MENU_ITEMS.map((item) => (
          <Card
            key={item.href}
            sx={{
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            <CardActionArea component={Link} href={item.href}>
              <CardContent sx={{ py: 4 }}>
                <Typography variant="h3" sx={{ color: "primary.main", mb: 1 }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

/** 「回答数 80問」のように、項目名と値を並べて表示する小さな部品 */
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "baseline" }}
    >
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="h3">{value}</Typography>
    </Stack>
  );
}
