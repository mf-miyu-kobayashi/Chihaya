"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { PoemCard } from "@/components/PoemCard";
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
  type Favorite,
} from "@/lib/favorites";
import { fetchPoems, searchPoemsByKimariji, type Poem } from "@/lib/poems";

/** 百人一首一覧画面（URL: /poems ）。仕様9章・10章・20章 */
export default function PoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  // 検索の種類。"all" は仕様10章どおりの全項目検索、
  // "kimariji" は決まり字だけを見る検索
  const [searchMode, setSearchMode] = useState<"all" | "kimariji">("all");
  // 決まり字検索の結果（まだ検索していないときは null）
  const [kimarijiResults, setKimarijiResults] = useState<Poem[] | null>(null);
  const [searching, setSearching] = useState(false);
  // 通信中の歌のID。連打で二重登録されるのを防ぐために使う
  const [pendingPoemId, setPendingPoemId] = useState<number | null>(null);

  useEffect(() => {
    // Promise.all で2つのAPIを同時に呼ぶ。順番に待つより速い
    Promise.all([fetchPoems(), fetchFavorites()])
      .then(([poemList, favoriteList]) => {
        setPoems(poemList);
        setFavorites(favoriteList);
      })
      .catch(() => setError("データを取得できませんでした。もう一度お試しください。"))
      .finally(() => setLoading(false));
  }, []);

  /**
   * 決まり字検索。入力のたびにAPIを呼ぶと通信が多くなるので、
   * 入力が止まってから300ミリ秒後に1回だけ呼ぶ（デバウンス）。
   * useEffect が返す関数は「次に実行される前」に呼ばれるので、
   * そこでタイマーを取り消せば、打っている間はリクエストが飛ばない。
   */
  useEffect(() => {
    if (searchMode !== "kimariji") {
      setKimarijiResults(null);
      return;
    }
    const query = keyword.trim();
    if (!query) {
      setKimarijiResults(null);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      searchPoemsByKimariji(query)
        .then((data) => setKimarijiResults(data))
        .catch(() =>
          setError("データを取得できませんでした。もう一度お試しください。"),
        )
        .finally(() => setSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchMode, keyword]);

  const filtered = useMemo(() => {
    const query = keyword.trim();
    if (!query) return poems;

    return poems.filter((poem) =>
      // 仕様10章の検索対象: 番号・決まり字・上の句・下の句・作者
      [
        String(poem.number),
        poem.kimariji,
        poem.kami,
        poem.shimo,
        poem.author,
      ].some((field) => field.includes(query)),
    );
  }, [poems, keyword]);

  // 画面に表示する歌。決まり字検索のときはAPIの結果、
  // それ以外は画面内で絞り込んだ結果を使う
  const displayed =
    searchMode === "kimariji" ? (kimarijiResults ?? poems) : filtered;

  /** その歌のお気に入り情報を探す。未登録なら undefined */
  const findFavorite = (poemId: number) =>
    favorites.find((f) => f.poem_id === poemId);

  /** ♡ を押したときの処理（登録と解除の切り替え） */
  const handleToggleFavorite = async (poemId: number) => {
    const favorite = findFavorite(poemId);
    setPendingPoemId(poemId);
    try {
      if (favorite) {
        await removeFavorite(favorite.id);
        setFavorites(favorites.filter((f) => f.id !== favorite.id));
      } else {
        const created = await addFavorite(poemId);
        setFavorites([...favorites, created]);
      }
    } catch {
      setError("お気に入りを更新できませんでした。もう一度お試しください。");
    } finally {
      setPendingPoemId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 3 }}>
        百人一首一覧
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 4, maxWidth: 480 }}>
        {/* 検索の種類を切り替える。exclusive を付けると1つだけ選べる */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={searchMode}
          onChange={(_, value) => {
            // 選択中のボタンをもう一度押すと null が来るので、そのときは変えない
            if (value) setSearchMode(value);
          }}
        >
          <ToggleButton value="all">すべての項目</ToggleButton>
          <ToggleButton value="kimariji">決まり字</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          fullWidth
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={
            searchMode === "kimariji"
              ? "決まり字をひらがなで入力（例: ちは）"
              : "番号・決まり字・上の句・下の句・作者で検索"
          }
          sx={{ backgroundColor: "background.paper" }}
        />

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {searchMode === "kimariji"
            ? "決まり字だけを見て探します。「ち」で ちは・ちぎりき・ちぎりお が出ます。"
            : "番号・決まり字・上の句・下の句・作者のどこかに含まれる歌を探します。"}
        </Typography>
      </Stack>

      {/* 読み込み中（仕様28章） */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* 取得失敗（仕様28章） */}
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 決まり字検索の通信中 */}
      {searching && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {/* 検索結果が0件（仕様28章） */}
      {!loading && !searching && !error && displayed.length === 0 && (
        <Alert severity="info">該当する百人一首がありません。</Alert>
      )}

      {!loading && !searching && displayed.length > 0 && (
        <>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {displayed.length}首
          </Typography>

          <Stack spacing={2}>
            {displayed.map((poem) => {
              const favorite = findFavorite(poem.id);

              return (
                <PoemCard
                  key={poem.id}
                  number={poem.number}
                  kami={poem.kami}
                  shimo={poem.shimo}
                  kamiKana={poem.kami_kana}
                  shimoKana={poem.shimo_kana}
                  kimariji={poem.kimariji}
                  author={poem.author}
                  authorKana={poem.author_kana}
                  href={`/poems/${poem.id}`}
                  isFavorite={Boolean(favorite)}
                  favoritePending={pendingPoemId === poem.id}
                  onToggleFavorite={() => handleToggleFavorite(poem.id)}
                />
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );
}
