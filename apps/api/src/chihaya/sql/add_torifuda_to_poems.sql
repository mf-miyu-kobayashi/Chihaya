-- poems テーブルに取り札（下の句の札）の画像URLの列を追加する
--
-- 実行方法（apps/api ディレクトリで）:
--   set -a; . ./.env; set +a
--   PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
--     -f src/chihaya/sql/add_torifuda_to_poems.sql

ALTER TABLE poems ADD COLUMN IF NOT EXISTS torifuda_url VARCHAR(255);
