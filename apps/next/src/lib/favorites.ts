/** お気に入りまわりのAPI呼び出し（仕様20章・25章） */

const API_BASE = "/api";

/** お気に入り1件ぶん（歌の情報も含む） */
export type Favorite = {
  /** favorites テーブルのID。解除するときに使う（歌のIDではない） */
  id: number;
  poem_id: number;
  created_at: string;
  number: number;
  kimariji: string;
  kami: string;
  shimo: string;
  kami_kana: string;
  shimo_kana: string;
  author: string;
  author_kana: string | null;
};

/** お気に入り一覧を取得する */
export async function fetchFavorites(): Promise<Favorite[]> {
  const response = await fetch(`${API_BASE}/favorites`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/** お気に入りに登録する */
export async function addFavorite(poemId: number): Promise<Favorite> {
  const response = await fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poemId }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/** お気に入りを解除する（引数は favorites テーブルのID） */
export async function removeFavorite(favoriteId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/favorites/${favoriteId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}
