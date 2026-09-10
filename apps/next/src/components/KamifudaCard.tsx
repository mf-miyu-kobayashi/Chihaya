import Box from "@mui/material/Box";

type Props = {
  /** 上の句のかな表記（例:「ちはやぶる かみよもきかず たつたがは」） */
  kamiKana: string;
};

/**
 * 上の句の札。
 *
 * 下の句の札（取り札）はウィキメディアに画像があるが、
 * 上の句だけが書かれた札の画像は公開されているものが無いため、
 * 取り札と同じ見た目（白地・緑の枠・縦書き3行）になるよう
 * CSSで描いている。
 */
export function KamifudaCard({ kamiKana }: Props) {
  // 上の句は「五・七・五」の3つに空白で区切られているので、そのまま3行にする
  const lines = kamiKana.split(" ");

  return (
    <Box
      sx={{
        // 実際のかるた札と同じ縦横比（100 : 140）
        aspectRatio: "100 / 140",
        width: "100%",
        backgroundColor: "#ffffff",
        border: "3px solid #7da640", // 取り札の枠と同じ緑
        borderRadius: 1,
        display: "flex",
        // 縦書きは右の行から始まるので、右端に寄せる
        justifyContent: "flex-end",
        p: 1.5,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          // writing-mode で縦書きにする。行は右から左へ並ぶ
          writingMode: "vertical-rl",
          color: "#000000",
          fontSize: "0.95rem",
          letterSpacing: "0.12em",
          lineHeight: 2.2,
        }}
      >
        {lines.map((line, index) => (
          <Box key={index} component="p" sx={{ m: 0 }}>
            {line}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
