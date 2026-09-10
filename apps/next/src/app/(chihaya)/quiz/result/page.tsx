"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { KimarijiText } from "@/components/KimarijiText";
import { RubyText } from "@/components/RubyText";
import { SectionTitle } from "@/components/SectionTitle";
import { loadQuizResult, type QuizResult } from "@/lib/quiz";

/** クイズ結果画面（URL: /quiz/result ）。仕様17〜19章 */
export default function QuizResultPage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  // 「間違えた問題を復習」を押したかどうか
  const [reviewing, setReviewing] = useState(false);

  // sessionStorage はブラウザにしか無いので、画面表示後（useEffect）に読む
  useEffect(() => {
    setResult(loadQuizResult());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  // クイズをやらずに直接このURLを開いた場合
  if (!result) {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          クイズの結果がありません。
        </Alert>
        <Button component={Link} href="/quiz" variant="contained">
          クイズに挑戦する
        </Button>
      </Box>
    );
  }

  // 正解率（%）。小数が出ないよう四捨五入する
  const rate = Math.round((result.correctCount / result.total) * 100);
  const wrongAnswers = result.answers.filter((a) => !a.isCorrect);

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 4 }}>
        クイズ結果
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h1" sx={{ color: "primary.main", mb: 1 }}>
            {result.correctCount} / {result.total}問 正解
          </Typography>
          <Typography variant="h3" sx={{ mb: 3 }}>
            正解率 {rate}%
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            おつかれさまでした！
          </Typography>
        </CardContent>
      </Card>

      {/* ---- 間違えた問題（仕様18章）---- */}
      {wrongAnswers.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionTitle>間違えた問題</SectionTitle>

          <Stack spacing={2}>
            {wrongAnswers.map((answer) => (
              <Card key={answer.poem.id}>
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    第{answer.poem.number}首
                  </Typography>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    <RubyText
                      text={answer.poem.kami}
                      reading={answer.poem.kami_kana}
                    />
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    正解
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <RubyText
                      text={answer.poem.shimo}
                      reading={answer.poem.shimo_kana}
                    />
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    あなたの回答
                  </Typography>
                  <Typography variant="body1" sx={{ color: "error.main" }}>
                    <RubyText
                      text={answer.selected.shimo}
                      reading={answer.selected.shimo_kana}
                    />
                  </Typography>

                  {/* 「復習」を押したときだけ、決まり字つきの全文を表示する */}
                  {reviewing && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body1">
                        <KimarijiText
                          text={answer.poem.kami_kana}
                          kimariji={answer.poem.kimariji}
                        />
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", mb: 2 }}
                      >
                        {answer.poem.shimo_kana}
                      </Typography>
                      <Stack direction="row" spacing={4}>
                        <Typography variant="body2">
                          <Box component="span" sx={{ color: "text.secondary" }}>
                            決まり字：
                          </Box>
                          {answer.poem.kimariji}
                        </Typography>
                        <Typography variant="body2">
                          <Box component="span" sx={{ color: "text.secondary" }}>
                            作者：
                          </Box>
                          <RubyText
                            text={answer.poem.author}
                            reading={answer.poem.author_kana}
                          />
                        </Typography>
                      </Stack>
                      <Button
                        component={Link}
                        href={`/poems/${answer.poem.id}`}
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        この歌の詳細を見る
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* ---- ボタン（仕様19章）---- */}
      <Stack direction="row" spacing={2}>
        <Button component={Link} href="/quiz" variant="contained">
          もう一度クイズ
        </Button>
        {wrongAnswers.length > 0 && (
          <Button variant="outlined" onClick={() => setReviewing(!reviewing)}>
            {reviewing ? "復習を閉じる" : "間違えた問題を復習"}
          </Button>
        )}
        <Button component={Link} href="/">
          ホームへ戻る
        </Button>
      </Stack>
    </Box>
  );
}
