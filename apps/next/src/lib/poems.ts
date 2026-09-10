/**
 * 百人一首データの型と、APIを呼び出す関数をまとめたファイル。
 * 画面ごとに fetch を書くと同じコードが増えるので、ここに集約する。
 */

/** APIから返ってくる1首ぶんのデータ（NestJS側の Poem 型と同じ形） */
export type Poem = {
  id: number;
  number: number;
  kimariji: string;
  kami: string;
  shimo: string;
  kami_kana: string;
  shimo_kana: string;
  author: string;
  /** 作者名の読み仮名 */
  author_kana: string | null;
  /** 現代語訳（無い場合は null） */
  translation: string | null;
  /** 取り札（下の句の札）の画像URL */
  torifuda_url: string | null;
  /** 絵札の画像URL（無い場合は null） */
  image_url: string | null;
};

// next.config.mjs の rewrites により、/api/... は自動的に
// http://localhost:3001/... （NestJS）へ転送される。
// 同じオリジンへのリクエストになるので、CORS を気にしなくてよい。
const API_BASE = "/api";

/** 100首の一覧を取得する */
export async function fetchPoems(): Promise<Poem[]> {
  const response = await fetch(`${API_BASE}/poems`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/**
 * 決まり字で検索する（仕様25章の GET /poems/search/kimariji/:text）。
 *
 * サーバー側で「決まり字そのもの」だけを見て絞り込むので、
 * 上の句や作者にたまたま同じ文字が含まれる歌はヒットしない。
 *   「ち」   → 決まり字が「ち」で始まる3首（ちは・ちぎりき・ちぎりお）
 *   「ちはや」→ 決まり字「ちは」の第17首（入力が決まり字より長くてもよい）
 */
export async function searchPoemsByKimariji(text: string): Promise<Poem[]> {
  // 日本語やスラッシュをURLで安全に扱える形に変換する
  const response = await fetch(
    `${API_BASE}/poems/search/kimariji/${encodeURIComponent(text)}`,
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/**
 * IDを指定して1首を取得する。
 *
 * その歌が存在しない場合（404）は null を返す。
 * 「通信そのものが失敗した」場合とは画面に出すメッセージが違うため、
 * 例外にせず戻り値で区別できるようにしている。
 */
export async function fetchPoem(id: number): Promise<Poem | null> {
  const response = await fetch(`${API_BASE}/poems/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
