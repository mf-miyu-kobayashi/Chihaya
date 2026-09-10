"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PoemCard } from "@/components/PoemCard";
import { fetchFavorites, removeFavorite, type Favorite } from "@/lib/favorites";

/** お気に入り画面（URL: /favorites ）。仕様20章 */
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFavorites()
      .then((data) => setFavorites(data))
      .catch(() => setError("データを取得できませんでした。もう一度お試しください。"))
      .finally(() => setLoading(false));
  }, []);

  /** ♥ を押したらお気に入りから外し、一覧からも消す */
  const handleRemove = async (favorite: Favorite) => {
    setPendingId(favorite.id);
    try {
      await removeFavorite(favorite.id);
      setFavorites(favorites.filter((f) => f.id !== favorite.id));
    } catch {
      setError("お気に入りを更新できませんでした。もう一度お試しください。");
    } finally {
      setPendingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 3 }}>
        お気に入り
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!error && favorites.length === 0 ? (
        <Alert severity="info">
          お気に入りに登録された歌がありません。
          <Link href="/poems">百人一首一覧</Link>の ♡ から登録できます。
        </Alert>
      ) : (
        <>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {favorites.length}首
          </Typography>

          <Stack spacing={2}>
            {favorites.map((favorite) => (
              <PoemCard
                key={favorite.id}
                number={favorite.number}
                kami={favorite.kami}
                shimo={favorite.shimo}
                kamiKana={favorite.kami_kana}
                shimoKana={favorite.shimo_kana}
                kimariji={favorite.kimariji}
                author={favorite.author}
                authorKana={favorite.author_kana}
                href={`/poems/${favorite.poem_id}`}
                isFavorite
                favoritePending={pendingId === favorite.id}
                onToggleFavorite={() => handleRemove(favorite)}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
