"use client";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AccuracyChart } from "@/components/AccuracyChart";
import { RubyText } from "@/components/RubyText";
import { SectionTitle } from "@/components/SectionTitle";
import { fetchStatistics, type Statistics } from "@/lib/quizResults";

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

/** 学習履歴画面（URL: /history ）。仕様21章 */
export default function HistoryPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatistics()
      .then((data) => setStats(data))
      .catch(() => setError("データを取得できませんでした。もう一度お試しください。"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return <Alert severity="error">{error || "データがありません。"}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 4 }}>
        学習履歴
      </Typography>

      {/* まだ一度もクイズをしていない場合 */}
      {stats.totalAnswers === 0 ? (
        <Alert severity="info">
          まだ学習の記録がありません。
          <Link href="/quiz">クイズに挑戦する</Link>と記録が残ります。
        </Alert>
      ) : (
        <Stack spacing={4}>
          {/* ---- 総合成績 ---- */}
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
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* ---- 正解率の推移（グラフ）---- */}
          <Box>
            <SectionTitle>正解率の推移</SectionTitle>
            <Card>
              <CardContent>
                <AccuracyChart recent={stats.recent} />
              </CardContent>
            </Card>
          </Box>

          {/* ---- 最近の学習（日ごと。グラフと同じ内容を数値でも読めるようにする）---- */}
          <Box>
            <SectionTitle>最近の学習</SectionTitle>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  {stats.recent.map((day, index) => (
                    <Box key={day.date}>
                      {index > 0 && <Divider sx={{ mb: 2 }} />}
                      <Stack
                        direction="row"
                        spacing={4}
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Typography variant="body1">
                          {/* 2026-09-10 → 9/10 の形に変換して表示する */}
                          {formatDate(day.date)}
                        </Typography>
                        <Typography variant="body1">
                          {day.answer_count}問
                        </Typography>
                        <Typography variant="body1">
                          {day.correct_count}問正解
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* ---- 苦手な歌 ---- */}
          <Box>
            <SectionTitle>苦手な歌</SectionTitle>
            <Stack spacing={2}>
              {stats.weakPoems.map((poem) => (
                <Card key={poem.poem_id}>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={3}
                      sx={{ justifyContent: "space-between", alignItems: "center" }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          第{poem.number}首
                        </Typography>
                        <Typography
                          variant="h3"
                          component={Link}
                          href={`/poems/${poem.poem_id}`}
                          sx={{ textDecoration: "none", color: "text.primary" }}
                        >
                          <RubyText text={poem.kami} reading={poem.kami_kana} />
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography variant="h3" sx={{ color: "primary.main" }}>
                          正解率 {poem.correct_rate}%
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {poem.answer_count}回中{poem.correct_count}回正解
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );
}

/** "2026-09-10" を "9/10" に変換する */
function formatDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}
