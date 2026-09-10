import Box from "@mui/material/Box";
import { KIMARIJI_COLOR } from "@/colors";

type Props = {
  /** かな表記の上の句（例: 「ちはやぶる かみよもきかず たつたがは」） */
  text: string;
  /** 決まり字（例: 「ちは」） */
  kimariji: string;
};

/**
 * 上の句のうち、決まり字の部分だけを赤くして表示する部品（仕様7章）。
 *
 * 【なぜ「かな表記」を渡すのか】
 * 決まり字は読み方なので、漢字まじりの表記とは先頭が一致しない。
 * 例）第1首の決まり字は「あきの」だが、漢字表記は「秋の田の」で
 *     先頭3文字は「秋の田」。これでは赤くする範囲を決められない。
 * かな表記「あきのたの」なら、先頭から決まり字の文字数ぶんを
 * 赤くするだけでよい。
 *
 * 【空白の扱い】
 * かな表記には句の区切りの空白が入っている（「ちはやぶる かみよ…」）。
 * 空白は文字数に数えず、決まり字の文字数ぶんの「かな」を赤くする。
 */
export function KimarijiText({ text, kimariji }: Props) {
  let counted = 0; // 空白を除いて何文字ぶん進んだか
  let splitAt = text.length; // 赤くする範囲の終わり（文字位置）

  for (let i = 0; i < text.length; i++) {
    if (counted === kimariji.length) {
      splitAt = i;
      break;
    }
    if (text[i] !== " ") counted++;
  }

  const head = text.slice(0, splitAt); // 決まり字の部分（赤）
  const tail = text.slice(splitAt); // 残りの部分（墨色）

  return (
    <Box component="span">
      <Box component="span" sx={{ color: KIMARIJI_COLOR, fontWeight: 700 }}>
        {head}
      </Box>
      <Box component="span">{tail}</Box>
    </Box>
  );
}
