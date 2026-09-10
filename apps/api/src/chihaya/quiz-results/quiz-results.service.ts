import { Injectable } from '@nestjs/common';
import { pool } from '../../onboarding-backend/database';

/** 1件ぶんの回答結果（歌の情報も一緒に取得する） */
export type QuizResultRow = {
  id: number;
  poem_id: number;
  is_correct: boolean;
  answered_at: string;
  number: number;
  kami: string;
};

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

/** 学習統計（仕様25章 GET /quiz-results/statistics の戻り値） */
export type Statistics = {
  totalAnswers: number;
  correctAnswers: number;
  correctRate: number;
  recent: DailyResult[];
  weakPoems: WeakPoem[];
};

@Injectable()
export class QuizResultsService {
  /** 回答結果を1件保存する */
  async create(poemId: number, isCorrect: boolean) {
    const result = await pool.query(
      `INSERT INTO quiz_results (poem_id, is_correct)
       VALUES ($1, $2)
       RETURNING id, poem_id, is_correct, answered_at`,
      [poemId, isCorrect],
    );
    return result.rows[0];
  }

  /** 学習履歴（回答結果の一覧）を新しい順に取得する */
  async findAll(limit = 100): Promise<QuizResultRow[]> {
    const result = await pool.query<QuizResultRow>(
      `SELECT r.id, r.poem_id, r.is_correct, r.answered_at, p.number, p.kami
         FROM quiz_results r
         -- JOIN で poems の情報（番号・上の句）も一緒に取得する
         JOIN poems p ON p.id = r.poem_id
        ORDER BY r.answered_at DESC
        LIMIT $1`,
      [limit],
    );
    return result.rows;
  }

  /**
   * 苦手な歌（正解率が低い順）を取得する。
   *
   * 学習履歴画面では5首だけ表示するが、「苦手な歌だけでクイズ」では
   * もっと多くの歌が必要になるため、件数を指定できるようにしている。
   */
  async findWeakPoems(limit = 20): Promise<WeakPoem[]> {
    const result = await pool.query<WeakPoem>(
      `SELECT p.id      AS poem_id,
              p.number  AS number,
              p.kami    AS kami,
              p.kami_kana AS kami_kana,
              COUNT(*)::int AS answer_count,
              COUNT(*) FILTER (WHERE r.is_correct)::int AS correct_count,
              ROUND(COUNT(*) FILTER (WHERE r.is_correct) * 100.0 / COUNT(*))::int
                AS correct_rate
         FROM quiz_results r
         JOIN poems p ON p.id = r.poem_id
        GROUP BY p.id, p.number, p.kami, p.kami_kana
        ORDER BY correct_rate ASC, answer_count DESC
        LIMIT $1`,
      [limit],
    );
    return result.rows;
  }

  /** 学習統計をまとめて計算する */
  async getStatistics(): Promise<Statistics> {
    // ① 総回答数と正解数
    // COUNT(*) は全件、COUNT(*) FILTER (WHERE ...) は条件に合う件数を数える
    const totals = await pool.query<{ total: string; correct: string }>(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE is_correct) AS correct
         FROM quiz_results`,
    );
    // COUNT の結果は文字列で返ってくるため、数値に変換する
    const totalAnswers = Number(totals.rows[0].total);
    const correctAnswers = Number(totals.rows[0].correct);

    // ② 日ごとの成績（最近7日ぶん）
    const recent = await pool.query<DailyResult>(
      `SELECT to_char(answered_at, 'YYYY-MM-DD') AS date,
              COUNT(*)::int                      AS answer_count,
              COUNT(*) FILTER (WHERE is_correct)::int AS correct_count
         FROM quiz_results
        -- 日付ごとにまとめて集計する
        GROUP BY to_char(answered_at, 'YYYY-MM-DD')
        ORDER BY date DESC
        LIMIT 7`,
    );

    // ③ 苦手な歌（正解率が低い順に5首）
    const weakPoems = await this.findWeakPoems(5);

    return {
      totalAnswers,
      correctAnswers,
      // 0件のときに 0 で割らないよう分岐する
      correctRate:
        totalAnswers === 0
          ? 0
          : Math.round((correctAnswers / totalAnswers) * 100),
      recent: recent.rows,
      weakPoems,
    };
  }
}
