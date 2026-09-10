-- poems テーブルに作者名の読み仮名の列を追加する
--
-- 実行方法（apps/api ディレクトリで）:
--   set -a; . ./.env; set +a
--   PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
--     -f src/chihaya/sql/add_author_kana_to_poems.sql

ALTER TABLE poems ADD COLUMN IF NOT EXISTS author_kana VARCHAR(100);
