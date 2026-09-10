-- poems テーブルに現代語訳の列を追加する
--
-- 実行方法（apps/api ディレクトリで）:
--   set -a; . ./.env; set +a
--   PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
--     -f src/chihaya/sql/add_translation_to_poems.sql

ALTER TABLE poems ADD COLUMN IF NOT EXISTS translation TEXT;
