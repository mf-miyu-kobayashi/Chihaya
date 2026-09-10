"use client";

import { Box, Stack, Tooltip, Typography } from "@mui/material";
import type { DailyResult } from "@/lib/quizResults";

/** グラフに表示する日数 */
const DAYS = 7;

/** Date を "2026-09-10" の形の文字列にする（APIの date と同じ形式） */
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 日ごとの正解率を棒グラフで表示する。
 *
 * グラフ用のライブラリは追加せず、棒の「高さ」をCSSのパーセント指定で
 * 表現している（正解率80% → 高さ80%）。
 *
 * 学習しなかった日も枠だけ表示する。記録のある日だけを並べると、
 * 間隔がとびとびになって「推移」が読み取れなくなるため。
 */
export function AccuracyChart({ recent }: { recent: DailyResult[] }) {
  const today = new Date();

  // 今日から数えて過去7日ぶんの枠を作り、記録があれば当てはめる
  const days = Array.from({ length: DAYS }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (DAYS - 1 - i));
    const key = toDateKey(date);
    return {
      key,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      result: recent.find((r) => r.date === key) ?? null,
    };
  });

  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      {/* 左側の目盛り（100% / 50% / 0%） */}
      <Stack
        sx={{
          width: 36,
          height: 180,
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexShrink: 0,
        }}
      >
        {[100, 50, 0].map((tick) => (
          <Typography
            key={tick}
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.75rem", lineHeight: 1 }}
          >
            {tick}%
          </Typography>
        ))}
      </Stack>

      <Box sx={{ flexGrow: 1 }}>
        {/* 棒を並べる領域。目盛り線は背景として薄く敷く */}
        <Box
          sx={{
            position: "relative",
            height: 180,
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {/* 目盛り線（0% / 50% / 100%）。数字より控えめな色にする */}
          {[0, 50, 100].map((tick) => (
            <Box
              key={tick}
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${tick}%`,
                borderTop: 1,
                borderColor: "divider",
              }}
            />
          ))}

          {days.map((day) => {
            const rate = day.result
              ? Math.round((day.result.correct_count / day.result.answer_count) * 100)
              : null;

            return (
              <Tooltip
                key={day.key}
                title={
                  day.result
                    ? `${day.label}　${day.result.answer_count}問中${day.result.correct_count}問正解（正解率${rate}%）`
                    : `${day.label}　記録なし`
                }
                arrow
              >
                <Box
                  sx={{
                    position: "relative",
                    flex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {rate !== null && (
                    <>
                      {/* 数値は文字色で表示する（棒の色を文字に使わない） */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.secondary",
                          mb: 0.5,
                        }}
                      >
                        {rate}%
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: 44,
                          // 正解率をそのまま高さのパーセントにする
                          height: `${rate}%`,
                          minHeight: 3, // 0%でも棒があることが分かるように
                          backgroundColor: "primary.main",
                          // 上端だけ角を丸める（下端は目盛りの0%線に接地させる）
                          borderRadius: "4px 4px 0 0",
                        }}
                      />
                    </>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* 日付のラベル */}
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          {days.map((day) => (
            <Typography
              key={day.key}
              variant="body2"
              sx={{
                flex: 1,
                textAlign: "center",
                fontSize: "0.75rem",
                color: day.result ? "text.primary" : "text.secondary",
              }}
            >
              {day.label}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
