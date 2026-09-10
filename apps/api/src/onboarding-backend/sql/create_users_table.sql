-- 画面（/onboarding/users）で表示・操作するデータを保存するテーブル

CREATE TABLE IF NOT EXISTS users (

  id    SERIAL       PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL
);


--実行するコマンドは「 psql -d postgres -c "SELECT * FROM users ORDER BY id;" 」
