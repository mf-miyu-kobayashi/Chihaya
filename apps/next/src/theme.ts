import { createTheme } from "@mui/material/styles";
import { BORDER, PAPER, SUMI, TATAMI, VERMILION } from "./colors";

// 決まり字の色は colors.ts に移動した。
// 今まで theme.ts から import していた箇所のために、ここでも再公開しておく。
export { KIMARIJI_COLOR } from "./colors";

/**
 * createTheme はアプリ全体で共通のデザイン設定（色・文字・角丸など）を作る関数。
 * ここで作ったテーマを ThemeProvider に渡すと、MUI のコンポーネントが
 * 自動的にこの設定を使うようになる。
 *
 * 個々の画面に色や余白を直接書かず、できるだけこのファイルにまとめることで、
 * 全画面の見た目を一度に調整できるようにしている。
 */
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: VERMILION,
      dark: "#8e2f22",
      light: "#d9705e",
      contrastText: "#ffffff",
    },
    background: {
      default: TATAMI.base,
      paper: PAPER,
    },
    text: {
      primary: SUMI,
      secondary: "#6b655f",
    },
    divider: BORDER,
  },
  typography: {
    // 和の雰囲気を出すため明朝体を優先し、無い環境ではゴシックにフォールバックする
    fontFamily: [
      '"Hiragino Mincho ProN"',
      '"Yu Mincho"',
      '"Noto Serif JP"',
      "serif",
    ].join(","),
    // 日本語は文字が詰まって見えやすいので、行間（lineHeight）と
    // 字間（letterSpacing）を欧文の初期値より広めにしている
    h1: { fontSize: "2.75rem", fontWeight: 600, letterSpacing: "0.1em", lineHeight: 1.4 },
    h2: { fontSize: "1.75rem", fontWeight: 600, letterSpacing: "0.08em", lineHeight: 2.1 },
    h3: { fontSize: "1.375rem", fontWeight: 600, letterSpacing: "0.06em", lineHeight: 2.1 },
    body1: { fontSize: "1rem", letterSpacing: "0.05em", lineHeight: 1.9 },
    body2: { fontSize: "0.875rem", letterSpacing: "0.04em", lineHeight: 1.8 },
    button: { letterSpacing: "0.1em", fontWeight: 600 },
  },
  shape: {
    // 角を少し丸くして、かたすぎない印象にする
    borderRadius: 10,
  },
  components: {
    // ルビ（<rt>）の見た目。本文より小さく、控えめな色にする。
    // 1か所で決めておけば、ルビを使うすべての画面にそのまま効く。
    MuiCssBaseline: {
      styleOverrides: {
        rt: {
          fontSize: "0.5em",
          fontWeight: 400,
          color: "#6b655f",
          letterSpacing: "normal",
        },
      },
    },
    // カードは影を強く出さず、細い罫線で「紙」らしく見せる
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${BORDER}`,
          backgroundColor: PAPER,
          // 枠線や影が変わるときに、なめらかに切り替わるようにする
          transition: "border-color 200ms, box-shadow 200ms",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 28,
          // MUI は最後の子要素の下だけ余白を広げる初期設定なので、上下をそろえる
          "&:last-child": { paddingBottom: 28 },
        },
      },
    },
    // カード全体がリンク／ボタンになっている部分。触れたときにうっすら色を付ける
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "rgba(183, 65, 47, 0.03)" },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { paddingInline: 24, paddingBlock: 10 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { border: `1px solid ${BORDER}`, letterSpacing: "0.04em" },
      },
    },
    // 検索欄。触れたとき・入力中の枠線を朱色にする
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: VERMILION,
          },
        },
      },
    },
  },
});
