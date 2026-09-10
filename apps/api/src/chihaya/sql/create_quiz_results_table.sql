-- クイズの回答結果を保存するテーブル（仕様24章）
--
-- このテーブルの行を集計することで、
-- 「総回答数」「正解数」「正解率」「苦手な歌」「最近の学習」を計算する。
--
-- 実行方法（apps/api ディレクトリで）:
--   set -a; . ./.env; set +a
--   PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
--     -f src/chihaya/sql/create_quiz_results_table.sql

CREATE TABLE IF NOT EXISTS quiz_results (
  id          SERIAL    PRIMARY KEY,
  -- どの歌に対する回答か。REFERENCES を付けると、
  -- poems に存在しない ID を保存しようとしたときに DB 側で弾いてくれる
  poem_id     INTEGER   NOT NULL REFERENCES poems(id),
  -- 正解なら true、不正解なら false
  is_correct  BOOLEAN   NOT NULL,
  answered_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 「苦手な歌」は poem_id ごとの集計、「最近の学習」は日付順の並べ替えを行う。
-- 件数が増えたときに速く処理できるよう、あらかじめ索引を作っておく。
CREATE INDEX IF NOT EXISTS idx_quiz_results_poem_id ON quiz_results (poem_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_answered_at ON quiz_results (answered_at);
