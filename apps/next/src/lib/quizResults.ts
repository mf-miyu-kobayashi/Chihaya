/**
 * クイズの回答結果・学習統計まわりのAPI呼び出し。
 */

const API_BASE = "/api";

/** 苦手な歌1件ぶん */
export type WeakPoem = {
  poem_id: number;
  number: number;
  kami: string;
  kami_kana: string;
  answer_count: number;
  correct_count: number;
  correct_rate: number;
};

/** 日ごとの学習成績 */
export type DailyResult = {
  date: string;
  answer_count: number;
  correct_count: number;
};

/** 学習統計（仕様21章の画面で使う） */
export type Statistics = {
  totalAnswers: number;
  correctAnswers: number;
  correctRate: number;
  recent: DailyResult[];
  weakPoems: WeakPoem[];
};

/**
 * 回答結果を1件保存する。
 *
 * 保存に失敗してもクイズは続けられるようにしたいので、
 * ここでは例外を投げず、成功したかどうかだけを返す。
 */
export async function postQuizResult(
  poemId: number,
  isCorrect: boolean,
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/quiz-results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // JavaScript のオブジェクトを JSON の文字列に変換して送る
      body: JSON.stringify({ poemId, isCorrect }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 苦手な歌（正解率が低い順）を取得する。
 * 「苦手な歌だけでクイズ」の出題対象を決めるために使う。
 */
export async function fetchWeakPoems(limit = 20): Promise<WeakPoem[]> {
  const response = await fetch(`${API_BASE}/quiz-results/weak-poems?limit=${limit}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/** 学習統計を取得する */
export async function fetchStatistics(): Promise<Statistics> {
  const response = await fetch(`${API_BASE}/quiz-results/statistics`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
