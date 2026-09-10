-- お気に入り情報を保存するテーブル（仕様23章）
--
-- 実行方法（apps/api ディレクトリで）:
--   set -a; . ./.env; set +a
--   PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
--     -f src/chihaya/sql/create_favorites_table.sql

CREATE TABLE IF NOT EXISTS favorites (
  id         SERIAL    PRIMARY KEY,
  -- どの歌をお気に入りにしたか。poems に無いIDは保存できないようにする。
  -- UNIQUE を付けているのは、同じ歌が二重に登録されるのを防ぐため
  -- （お気に入りは「登録されているか、いないか」の2状態しかないため）。
  poem_id    INTEGER   NOT NULL UNIQUE REFERENCES poems(id),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
