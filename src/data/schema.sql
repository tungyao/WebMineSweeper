CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL,
  time INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  UNIQUE(nickname, difficulty)
);
