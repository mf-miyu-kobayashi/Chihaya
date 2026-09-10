import { Injectable } from '@nestjs/common';
// DB接続（Pool）は既存のオンボーディング課題で作ったものをそのまま使い回す。
// 接続を何個も作らないようにするため、新しく Pool は作らない。
import { pool } from '../../onboarding-backend/database';

/**
 * 1首ぶんの歌のデータ。
 * DBの列名（snake_case）とそろえてあるので、SELECT した結果をそのまま返せる。
 */
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
  /** 現代語訳 */
  translation: string | null;
  /** 取り札（下の句の札）の画像URL */
  torifuda_url: string | null;
  /** 絵札の画像URL（データが無い歌もあるため null を許容する） */
  image_url: string | null;
};

/** 毎回書くと長いので、取り出す列をまとめておく */
const COLUMNS =
  `id, number, kimariji, kami, shimo, kami_kana, shimo_kana,
   author, author_kana, translation, image_url, torifuda_url`;

@Injectable()
export class PoemsService {
  /** 100首すべてを番号順に取得する */
  async findAll(): Promise<Poem[]> {
    const result = await pool.query<Poem>(
      `SELECT ${COLUMNS} FROM poems ORDER BY number`,
    );
    return result.rows;
  }

  /** IDを1つ指定して取得する。見つからなければ null を返す */
  async findOne(id: number): Promise<Poem | null> {
    const result = await pool.query<Poem>(
      `SELECT ${COLUMNS} FROM poems WHERE id = $1`,
      // $1 のように書いて値を別に渡すと、SQLインジェクションを防げる
      [id],
    );
    return result.rows[0] ?? null;
  }

  /**
   * 決まり字で検索する。
   *
   * 2方向で一致を見ている:
   *   ・「ち」で検索 → 決まり字「ちは」「ちぎりき」などがヒット（入力が短い場合）
   *   ・「ちはや」で検索 → 決まり字「ちは」の歌がヒット（入力が長い場合）
   */
  async searchByKimariji(text: string): Promise<Poem[]> {
    const query = text.trim();
    if (!query) return [];

    const result = await pool.query<Poem>(
      `SELECT ${COLUMNS} FROM poems
        WHERE kimariji LIKE $1 || '%' OR $1 LIKE kimariji || '%'
        ORDER BY number`,
      [query],
    );
    return result.rows;
  }
}
