"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { KamifudaCard } from "@/components/KamifudaCard";
import { KimarijiText } from "@/components/KimarijiText";
import { RubyText } from "@/components/RubyText";
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
  type Favorite,
} from "@/lib/favorites";
import { fetchPoem, type Poem } from "@/lib/poems";

/**
 * 百人一首詳細画面（URL: /poems/[id] ）。仕様11章
 *
 * フォルダ名を [id] にすると「その部分が変わる値」を表すルートになり、
 * /poems/17 でも /poems/42 でも、このファイルが表示される。
 */
export default function PoemDetailPage() {
  // useParams で URL の [id] の部分（文字列）を受け取る
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // 「通信に失敗した」のか「その歌が無い」のかを区別するための状態
  const [notFound, setNotFound] = useState(false);
  // この歌のお気に入り情報（未登録なら null）
  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [favoritePending, setFavoritePending] = useState(false);

  useEffect(() => {
    // 歌の情報とお気に入りの状態を同時に取得する
    Promise.all([fetchPoem(id), fetchFavorites()])
      .then(([data, favorites]) => {
        if (data) setPoem(data);
        else setNotFound(true); // APIが404を返した＝その番号の歌は無い
        // 一覧の中からこの歌のお気に入りを探す
        setFavorite(favorites.find((f) => f.poem_id === id) ?? null);
      })
      .catch(() => setError("データを取得できませんでした。もう一度お試しください。"))
      .finally(() => setLoading(false));
    // id が変わったら取得し直す
  }, [id]);

  /** ♡ を押したときの処理（登録と解除の切り替え）仕様20章 */
  const handleToggleFavorite = async () => {
    if (!poem) return;
    setFavoritePending(true);
    try {
      if (favorite) {
        await removeFavorite(favorite.id);
        setFavorite(null);
      } else {
        setFavorite(await addFavorite(poem.id));
      }
    } catch {
      setError("お気に入りを更新できませんでした。もう一度お試しください。");
    } finally {
      setFavoritePending(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || notFound || !poem) {
    return (
      <Box>
        <Alert severity={error ? "error" : "info"} sx={{ mb: 3 }}>
          {error || "該当する百人一首がありません。"}
        </Alert>
        <Button component={Link} href="/poems">
          一覧へ戻る
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        第{poem.number}首
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            <RubyText text={poem.kami} reading={poem.kami_kana} />
          </Typography>
          <Typography variant="h2" sx={{ mb: 4 }}>
            <RubyText text={poem.shimo} reading={poem.shimo_kana} />
          </Typography>

          {/* 決まり字だけ赤くしたかな表記（仕様7章） */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            <KimarijiText text={poem.kami_kana} kimariji={poem.kimariji} />
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {poem.shimo_kana}
          </Typography>
        </CardContent>
      </Card>

      {/* 現代語訳（データが無い歌もあるので、あるときだけ表示する） */}
      {poem.translation && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              現代語訳
            </Typography>
            <Typography variant="body1">{poem.translation}</Typography>
          </CardContent>
        </Card>
      )}

      {/*
        札の表示。
        next/image は表示サイズに合わせて画像を最適化してくれる部品で、
        外部サイトの画像を使うには next.config.mjs でドメインの許可が必要。
      */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack
            direction="row"
            spacing={4}
            sx={{ justifyContent: "center", alignItems: "flex-start" }}
          >
            {poem.image_url && (
              <Box sx={{ textAlign: "center", width: 150 }}>
                <Image
                  src={poem.image_url}
                  alt={`第${poem.number}首の絵札`}
                  // 元画像が約161×227pxと小さいので、引き伸ばして
                  // ぼやけない大きさ（幅150px）に収めている
                  width={150}
                  height={210}
                  // 3枚の札は最初から見せたいので、遅延読み込みをやめる
                  loading="eager"
                  style={{ width: "100%", maxWidth: 150, height: "auto" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 1.5 }}
                >
                  絵札
                </Typography>
              </Box>
            )}

            <Box sx={{ textAlign: "center", width: 150 }}>
              <KamifudaCard kamiKana={poem.kami_kana} />
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1.5 }}
              >
                上の句の札
              </Typography>
            </Box>

            {poem.torifuda_url && (
              <Box sx={{ textAlign: "center", width: 150 }}>
                <Image
                  src={poem.torifuda_url}
                  alt={`第${poem.number}首の取り札`}
                  width={150}
                  height={210}
                  // SVG は最適化の対象外なので、そのまま表示する
                  unoptimized
                  loading="eager"
                  style={{ width: "100%", maxWidth: 150, height: "auto" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 1.5 }}
                >
                  下の句の札（取り札）
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            決まり字
          </Typography>
          <Typography variant="h3" sx={{ color: "primary.main" }}>
            {poem.kimariji}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            作者
          </Typography>
          <Typography variant="h3">
            <RubyText text={poem.author} reading={poem.author_kana} />
          </Typography>
        </Box>
      </Stack>

      {/* お気に入りの登録・解除（仕様20章） */}
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 4 }}>
        <FavoriteButton
          isFavorite={Boolean(favorite)}
          disabled={favoritePending}
          onToggle={handleToggleFavorite}
        />
        <Typography variant="body1">
          {favorite ? "お気に入り登録中" : "お気に入り"}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2}>
        {/* この歌を1問目にしてクイズを始める（仕様11章） */}
        <Button
          component={Link}
          href={`/quiz?poemId=${poem.id}`}
          variant="contained"
        >
          この歌でクイズ
        </Button>
        <Button component={Link} href="/poems" variant="outlined">
          一覧へ戻る
        </Button>
      </Stack>
    </Box>
  );
}
