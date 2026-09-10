/**
 * アプリで使う色をまとめたファイル。
 *
 * MUI に依存しないただの定数なので、サーバーコンポーネントからでも
 * 安全に import できる（theme.ts は MUI を読み込むため、サーバー
 * コンポーネントから直接 import しないようにしている）。
 */

/** 決まり字を表示するときの色（仕様7章「決まり字までを赤色にする」） */
export const KIMARIJI_COLOR = "#c0392b";

export const IVORY = "#faf7f0"; // 生成り
export const PAPER = "#ffffff"; // カードなどの面
export const SUMI = "#2e2c2a"; // 墨に近い濃いグレー（本文）
export const VERMILION = "#b7412f"; // 朱色（アクセント）
export const BORDER = "#e6ded0"; // 淡いベージュの罫線

/** 畳の色 */
export const TATAMI = {
  base: "#d8d2ae", // い草（畳表）
  heri: "#6f6a52", // 畳の縁（へり）
};
