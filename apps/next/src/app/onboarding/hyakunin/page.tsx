"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const MY_API_URL = "http://localhost:3001";

const HYAKUNIN_API_URL = "https://api.aoikujira.com/hyakunin/get2.php?fmt=json";

type KimarijiEntry = {
  kimariji: string;
  no: number;
};


type Poem = {
  no: number;
  kami: string;
  simo: string;
  kami_kana: string;
  simo_kana: string;
  sakusya: string;
  sakusya_kana: string;
  image: string;
};


type Match = {
  kimariji: string;
  poem: Poem;
};

export default function HyakuninPage() {
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchedText, setSearchedText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();

    const query = text.trim();
    if (!query) {
      setError("決まり字をひらがなで入力してください");
      setMatches([]);
      return;
    }

    setError("");
    setMatches([]);
    setLoading(true);

    try {
     
      const [entriesResponse, poemsResponse] = await Promise.all([
        fetch(`${MY_API_URL}/kimariji/${encodeURIComponent(query)}`),
        fetch(HYAKUNIN_API_URL),
      ]);

      if (!entriesResponse.ok) throw new Error(`自作API HTTP ${entriesResponse.status}`);
      if (!poemsResponse.ok) throw new Error(`外部API HTTP ${poemsResponse.status}`);

      const entries: KimarijiEntry[] = await entriesResponse.json();
      const poems: Poem[] = await poemsResponse.json();

      const joined = entries.flatMap((entry) => {
        const poem = poems.find((p) => p.no === entry.no);
        return poem ? [{ kimariji: entry.kimariji, poem }] : [];
      });

      setSearchedText(query);
      setMatches(joined);
    } catch {
      setError("取得に失敗しました。APIが起動しているか確認してください");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        決まり字から百人一首を引く
      </Typography>

      <Typography sx={{ mb: 2 }}>
        決まり字をひらがなで入力すると、対応する歌を表示します。
        「き」のように途中まで入力すると候補が複数出て、決まり字まで入力すると1首に絞られます。
      </Typography>

      <form onSubmit={search}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            label="決まり字"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="む / きみがためお など"
            size="small"
            sx={{ width: 280 }}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "検索中…" : "検索"}
          </Button>
        </Stack>
      </form>

      {error && (
        <Alert severity="error" sx={{ maxWidth: 560 }}>
          {error}
        </Alert>
      )}

      {!error && searchedText && matches.length === 0 && (
        <Alert severity="info" sx={{ maxWidth: 560 }}>
          「{searchedText}」に対応する歌は見つかりませんでした
        </Alert>
      )}

      {matches.length > 1 && (
        <Typography sx={{ mb: 1 }}>
          候補が{matches.length}件あります。もう少し入力すると1首に絞れます。
        </Typography>
      )}

      <Stack spacing={2} sx={{ mt: 1 }}>
        {matches.map(({ kimariji, poem }) => (
          <Card key={poem.no} sx={{ maxWidth: 560 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                第{poem.no}番 ／ 決まり字「{kimariji}」
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>
                {poem.kami}
              </Typography>
              <Typography variant="h6">{poem.simo}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {poem.kami_kana} {poem.simo_kana}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                {poem.sakusya}（{poem.sakusya_kana}）
              </Typography>

              {poem.image && (
                <img
                  src={poem.image.replace(/^http:/, "https:")}
                  alt={`${poem.sakusya}の歌かるた`}
                  style={{ marginTop: 12, width: 160, height: "auto" }}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
