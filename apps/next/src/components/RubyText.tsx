import Box from "@mui/material/Box";

/** ひらがな・カタカナかどうかを判定する（これ以外＝漢字とみなす） */
const KANA = /[ぁ-ゟ゠-ヿー]/;

/** 正規表現で特別な意味を持つ記号を、ただの文字として扱えるようにする */
const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * 歴史的仮名遣いの揺れを吸収するための対応表。
 * 例）本文「雲いにまがふ」に対して読みが「くもゐにまがふ」のような場合、
 *     「い」と「ゐ」を同じものとして照合する。
 */
const KANA_VARIANTS = [
  ["い", "ゐ"],
  ["え", "ゑ"],
  ["お", "を"],
  ["は", "わ"],
  ["じ", "ぢ"],
  ["ず", "づ"],
];

/** かな部分の照合パターンを作る（上の対応表を反映する） */
const kanaPattern = (text: string) =>
  [...text]
    .map((ch) => {
      const pair = KANA_VARIANTS.find((v) => v.includes(ch));
      return pair ? `[${pair.join("")}]` : escapeRegExp(ch);
    })
    .join("");

type Part = { text: string; ruby?: string };

/**
 * 本文と読みを対応付けて、「この漢字にはこの読み」という組を作る。
 *
 * 例）本文「秋の田の」＋読み「あきのたの」
 *   → 漢字とかなに分ける: [秋][の][田][の]
 *   → かなの部分は読みにもそのまま出るはずなので、
 *      「^(.+?)の(.+?)の$」という形で読みと照合する
 *   → 取り出せた「あき」「た」を、それぞれ漢字に割り当てる
 *
 * 対応付けできなかった場合は null を返し、呼び出し側で
 * 句全体にまとめてルビを振る形にする。
 */
function alignRuby(base: string, reading: string): Part[] | null {
  if (base === reading) return [{ text: base }];

  // 漢字のかたまりと、かなのかたまりに分ける
  const runs: { text: string; kana: boolean }[] = [];
  for (const ch of base) {
    const kana = KANA.test(ch);
    const last = runs[runs.length - 1];
    if (last && last.kana === kana) last.text += ch;
    else runs.push({ text: ch, kana });
  }

  // 漢字部分を (.+?) にして、読み全体と照合する
  const pattern =
    "^" +
    runs.map((r) => (r.kana ? kanaPattern(r.text) : "(.+?)")).join("") +
    "$";
  const matched = reading.match(new RegExp(pattern));
  if (!matched) return null;

  let i = 1;
  return runs.map((r) =>
    r.kana ? { text: r.text } : { text: r.text, ruby: matched[i++] },
  );
}

type Props = {
  /** 表示する本文（漢字まじり） */
  text: string;
  /** 読み仮名。無い場合はルビなしで本文だけ表示する */
  reading?: string | null;
};

/**
 * 漢字の上に読み仮名（ルビ）を振って表示する部品。
 *
 * HTML の <ruby> タグを使う。<ruby>漢字<rt>かんじ</rt></ruby> と書くと、
 * ブラウザが「漢字」の上に小さく「かんじ」を表示してくれる。
 */
export function RubyText({ text, reading }: Props) {
  if (!reading) return <>{text}</>;

  // 上の句・下の句は「秋の田の かりほの庵の 苫をあらみ」のように
  // 空白で句が区切られている。読みも同じ区切りなので、句ごとに対応付ける。
  const baseParts = text.split(" ");
  const readingParts = reading.split(" ");
  const sameShape = baseParts.length === readingParts.length;

  const segments = sameShape
    ? baseParts.map((b, i) => ({ base: b, reading: readingParts[i] }))
    : [{ base: text, reading }];

  return (
    <Box component="span">
      {segments.map((segment, index) => {
        const parts = alignRuby(segment.base, segment.reading);

        return (
          <Box component="span" key={index}>
            {/* 2つ目以降の句の前に、元の空白を戻す */}
            {index > 0 && " "}
            {parts ? (
              parts.map((part, i) =>
                part.ruby ? (
                  <ruby key={i}>
                    {part.text}
                    <rt>{part.ruby}</rt>
                  </ruby>
                ) : (
                  <Box component="span" key={i}>
                    {part.text}
                  </Box>
                ),
              )
            ) : (
              // 対応付けできなかったときは、句全体にまとめてルビを振る
              <ruby>
                {segment.base}
                <rt>{segment.reading}</rt>
              </ruby>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
