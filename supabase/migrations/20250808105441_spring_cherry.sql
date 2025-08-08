/*
  # キャラクターテーブルの作成

  1. 新しいテーブル
    - `characters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, キャラクター名)
      - `stats` (jsonb, 身体能力データ)
      - `triggers` (jsonb, トリガー構成データ)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. セキュリティ
    - charactersテーブルでRLSを有効化
    - 認証済みユーザーが自分のキャラクターのみアクセス可能なポリシーを追加

  3. 変更点
    - ユーザー認証はSupabaseの組み込み機能を使用
    - キャラクターデータの保存・取得機能
    - 適切なインデックスとセキュリティポリシー
*/

-- キャラクターテーブルの作成
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT '',
  stats jsonb NOT NULL DEFAULT '{
    "trion": 5,
    "speed": 1,
    "range": 1,
    "attack": 7,
    "defenseSupport": 6,
    "technique": 8
  }'::jsonb,
  triggers jsonb NOT NULL DEFAULT '{
    "main": [],
    "sub": []
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSを有効化
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- インデックスの作成
CREATE INDEX IF NOT EXISTS characters_user_id_idx ON characters(user_id);
CREATE INDEX IF NOT EXISTS characters_updated_at_idx ON characters(updated_at DESC);

-- RLSポリシーの作成
CREATE POLICY "Users can view own characters"
  ON characters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
  ON characters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
  ON characters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
  ON characters
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- updated_atを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atトリガーの作成
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();