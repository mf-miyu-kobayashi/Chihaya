import type { Poem } from "./poems";

/** 1回のクイズの問題数（仕様12章） */
export const QUIZ_LENGTH = 10;

/** 1問あたりの選択肢の数（仕様14章：4択） */
export const CHOICE_COUNT = 4;

/** 1問ぶんのデータ */
export type QuizQuestion = {
  /** 出題する歌（この歌の下の句が正解） */
  poem: Poem;
  /** 4つの選択肢。正解1つ＋別の歌3つが混ざった状態で入っている */
  choices: Poem[];
};

/** 1問に対する回答の記録 */
export type QuizAnswer = {
  /** 出題された歌 */
  poem: Poem;
  /** 選んだ選択肢の歌 */
  selected: Poem;
  isCorrect: boolean;
};

/** クイズ終了後に結果画面へ渡すデータ */
export type QuizResult = {
  total: number;
  correctCount: number;
  answers: QuizAnswer[];
};

/**
 * 配列の並び順をランダムに入れ替える（フィッシャー・イェーツのシャッフル）。
 *
 * 元の配列を壊さないよう [...items] でコピーしてから入れ替える。
 * 後ろから順に「まだ確定していない範囲」からランダムに1つ選び、
 * 末尾と交換していくことで、偏りのないシャッフルになる。
 */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * クイズを作る（仕様26章）。
 *
 * @param allPoems     100首すべて。不正解の選択肢はここから選ぶ
 * @param targetPoems  出題対象の歌。「苦手な歌だけ」「一字決まりだけ」など
 *                     絞り込んだ結果を渡す
 * @param firstPoem    最初の問題に必ず出したい歌（詳細画面の「この歌でクイズ」用）
 *
 * 出題対象が10首より少ないときは、その数だけ出題する
 * （例: 一字決まりは7首しかないので7問になる）。
 */
export function createQuiz(
  allPoems: Poem[],
  targetPoems: Poem[],
  firstPoem?: Poem,
): QuizQuestion[] {
  let targets: Poem[];
  if (firstPoem) {
    // 指定された歌を1問目に置き、残りはそれ以外からランダムに選ぶ
    const others = shuffle(targetPoems.filter((p) => p.id !== firstPoem.id));
    targets = [firstPoem, ...others.slice(0, QUIZ_LENGTH - 1)];
  } else {
    targets = shuffle(targetPoems).slice(0, QUIZ_LENGTH);
  }

  return targets.map((poem) => {
    // 不正解の選択肢は、出題中の歌以外の「全100首」からランダムに3つ選ぶ。
    // 出題対象が少ないときでも選択肢が偏らないようにするため。
    const wrongChoices = shuffle(allPoems.filter((p) => p.id !== poem.id)).slice(
      0,
      CHOICE_COUNT - 1,
    );
    // 正解を混ぜてから並び順をシャッフルする（正解が毎回同じ位置に来ないように）
    return { poem, choices: shuffle([poem, ...wrongChoices]) };
  });
}

/** 出題範囲の指定（クイズ設定画面で選ぶ） */
export type QuizRange = "all" | "weak" | "favorites";

/** 決まり字の文字数による絞り込み */
export type KimarijiLength = "any" | "1" | "2" | "3+";

/** 決まり字の文字数で歌を絞り込む */
export function filterByKimarijiLength(
  poems: Poem[],
  length: KimarijiLength,
): Poem[] {
  if (length === "any") return poems;
  if (length === "3+") return poems.filter((p) => p.kimariji.length >= 3);
  return poems.filter((p) => p.kimariji.length === Number(length));
}

/**
 * クイズ結果の受け渡しに使うキー。
 *
 * /quiz と /quiz/result は別ページなので、そのままでは結果を渡せない。
 * sessionStorage（タブを閉じるまで残るブラウザの保存領域）に一時保存して、
 * 結果画面で読み出す。
 */
const RESULT_KEY = "chihaya:quiz-result";

/** クイズ結果を保存する */
export function saveQuizResult(result: QuizResult) {
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

/** クイズ結果を読み出す。まだ無ければ null */
export function loadQuizResult(): QuizResult | null {
  const raw = sessionStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as QuizResult;
}
