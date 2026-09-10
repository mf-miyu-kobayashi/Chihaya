import { Injectable } from '@nestjs/common';
import { pool } from '../../onboarding-backend/database';

/**
 * お気に入り1件ぶん。
 * 画面で歌を表示できるよう、poems の情報も一緒に持たせている。
 */
export type Favorite = {
  id: number; // favorites テーブルのID（削除するときに使う）
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

@Injectable()
export class FavoritesService {
  /** お気に入り一覧を、歌の番号順に取得する */
  async findAll(): Promise<Favorite[]> {
    const result = await pool.query<Favorite>(
      `SELECT f.id, f.poem_id, f.created_at,
              p.number, p.kimariji, p.kami, p.shimo,
              p.kami_kana, p.shimo_kana, p.author, p.author_kana
         FROM favorites f
         JOIN poems p ON p.id = f.poem_id
        ORDER BY p.number`,
    );
    return result.rows;
  }

  /**
   * お気に入りに登録する。
   *
   * すでに登録済みの歌をもう一度登録しようとした場合、UNIQUE 制約で
   * エラーになってしまう。ボタンを二度押ししたときにエラー画面を
   * 出したくないので、ON CONFLICT で「何もしない」ようにしている。
   * その場合は INSERT の戻り値が空になるので、既存の行を取り直す。
   */
  async create(poemId: number): Promise<Favorite> {
    await pool.query(
      `INSERT INTO favorites (poem_id) VALUES ($1)
       ON CONFLICT (poem_id) DO NOTHING`,
      [poemId],
    );

    const result = await pool.query<Favorite>(
      `SELECT f.id, f.poem_id, f.created_at,
              p.number, p.kimariji, p.kami, p.shimo,
              p.kami_kana, p.shimo_kana, p.author, p.author_kana
         FROM favorites f
         JOIN poems p ON p.id = f.poem_id
        WHERE f.poem_id = $1`,
      [poemId],
    );
    return result.rows[0];
  }

  /** お気に入りを解除する。削除できたら true、対象が無ければ false */
  async remove(id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM favorites WHERE id = $1 RETURNING id`,
      [id],
    );
    // rowCount は削除された行数。0 なら対象が無かったということ
    return (result.rowCount ?? 0) > 0;
  }
}
