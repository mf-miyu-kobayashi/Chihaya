-- poems テーブルに絵札の画像URLの列を追加する
--
-- 実行方法（apps/api ディレクトリで）:
--   set -a; . ./.env; set +a
--   PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
--     -f src/chihaya/sql/add_image_url_to_poems.sql
--
-- IF NOT EXISTS を付けているので、何度実行してもエラーにならない。

ALTER TABLE poems ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);
