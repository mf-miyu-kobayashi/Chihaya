-- 百人一首の歌を保存するテーブル（仕様22.1）
--
-- 実行方法（apps/api ディレクトリで）:
--   set -a; . ./.env; set +a
--   PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
--     -f src/chihaya/sql/create_poems_table.sql

CREATE TABLE IF NOT EXISTS poems (
  id         SERIAL       PRIMARY KEY,
  -- 百人一首の番号（1〜100）。重複しないよう UNIQUE を付ける
  number     INTEGER      NOT NULL UNIQUE,
  -- 決まり字（例: 第17首なら「ちは」）
  kimariji   VARCHAR(10)  NOT NULL,
  -- 上の句・下の句（漢字まじりの表記）
  kami       VARCHAR(100) NOT NULL,
  shimo      VARCHAR(100) NOT NULL,
  -- 上の句・下の句のかな表記。
  -- 決まり字は「読み」なので、漢字まじりの表記（例:「秋の田の」）とは
  -- 先頭が一致せず、赤色表示ができない。かな表記（例:「あきのたの」）が
  -- あれば「先頭から決まり字の文字数ぶんを赤くする」だけで済むため保持する。
  kami_kana  VARCHAR(100) NOT NULL,
  shimo_kana VARCHAR(100) NOT NULL,
  -- 作者
  author     VARCHAR(100) NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT now(),
  updated_at TIMESTAMP    NOT NULL DEFAULT now()
);
