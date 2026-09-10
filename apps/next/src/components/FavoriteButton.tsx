"use client";

import IconButton from "@mui/material/IconButton";

type Props = {
  /** 登録済みかどうか。true なら ♥、false なら ♡ */
  isFavorite: boolean;
  onToggle: () => void;
  /** 通信中は押せないようにするために使う */
  disabled?: boolean;
};

/**
 * お気に入りの登録・解除ボタン（仕様20章）。
 *
 * アイコン用のライブラリ（@mui/icons-material）を追加せずに済むよう、
 * ハートは文字（♡ / ♥）で表示している。
 */
export function FavoriteButton({ isFavorite, onToggle, disabled }: Props) {
  return (
    <IconButton
      onClick={onToggle}
      disabled={disabled}
      // 画面読み上げでも意味が分かるようにラベルを付ける
      aria-label={isFavorite ? "お気に入りを解除する" : "お気に入りに登録する"}
      sx={{ color: "primary.main", fontSize: "1.5rem" }}
    >
      {isFavorite ? "♥" : "♡"}
    </IconButton>
  );
}
