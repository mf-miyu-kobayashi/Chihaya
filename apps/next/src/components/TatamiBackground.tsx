import Box from "@mui/material/Box";
import { TATAMI } from "@/colors";

/** 畳1枚の大きさ（px）。実際の畳と同じく縦横が 1:2 になるようにしている */
const MAT_WIDTH = 640;
const MAT_HEIGHT = 320;

/** 大きめの画面でも覆えるように、多めに敷き詰める（はみ出た分は隠す） */
const COLS = 5;
const ROWS = 6;

/**
 * 背景に畳を敷く部品。
 *
 * 画像ファイルは使わず、CSS の repeating-linear-gradient（同じ模様を
 * 繰り返し描くグラデーション）で「い草の目」を表現している。
 * 畳は普通、隣り合う畳で目の向きが縦・横と互い違い（市松）になるので、
 * マス目の位置から向きを計算して切り替えている。
 */
export function TatamiBackground() {
  // 0〜(COLS*ROWS-1) の配列を作り、1マスずつ畳として描く
  const mats = Array.from({ length: COLS * ROWS }, (_, i) => {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    // 行番号 + 列番号 が偶数か奇数かで、い草の目の向きを変える（市松模様）
    const isHorizontal = (row + col) % 2 === 0;
    return { key: i, isHorizontal };
  });

  return (
    <Box
      // 装飾専用なので、読み上げソフトからは無視させる
      aria-hidden
      sx={{
        position: "fixed", // 画面に固定し、スクロールしても背景は動かない
        inset: 0, // top/right/bottom/left をすべて 0 にする書き方
        zIndex: 0,
        pointerEvents: "none", // クリックを背景が奪わないようにする
        display: "grid",
        overflow: "hidden", // 画面からはみ出した畳は隠す
        gridTemplateColumns: `repeat(${COLS}, ${MAT_WIDTH}px)`,
        gridAutoRows: `${MAT_HEIGHT}px`,
        gap: "6px", // 畳と畳のすき間。下の色が見えて「縁」になる
        padding: "6px",
        backgroundColor: TATAMI.heri, // 畳の縁（へり）の色
      }}
    >
      {mats.map((mat) => (
        <Box
          key={mat.key}
          sx={{
            backgroundColor: TATAMI.base,
            // い草の目。細い線を 4px ごとに繰り返して織り目に見せる
            backgroundImage: `repeating-linear-gradient(
              ${mat.isHorizontal ? "0deg" : "90deg"},
              rgba(255, 255, 255, 0.35) 0px,
              rgba(255, 255, 255, 0.35) 1px,
              rgba(0, 0, 0, 0.05) 1px,
              rgba(0, 0, 0, 0.05) 2px,
              transparent 2px,
              transparent 4px
            )`,
          }}
        />
      ))}
    </Box>
  );
}
