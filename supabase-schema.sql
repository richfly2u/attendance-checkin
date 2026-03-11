-- 在 Supabase SQL Editor 執行此檔案

CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  picture TEXT,
  location TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  type TEXT DEFAULT 'checkin'
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_insert" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_select" ON attendance FOR SELECT USING (true);
