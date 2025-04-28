-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  recipient_id Text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ルーム設定テーブル
CREATE TABLE IF NOT EXISTS public.room_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ルームテーブル
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ルームメッセージテーブル
CREATE TABLE IF NOT EXISTS public.room_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- 送信者ID
  sender TEXT CHECK (sender IN ('user', 'ai')),
  content TEXT,
  image_path TEXT DEFAULT '',
  reply_to_message_id UUID REFERENCES public.room_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (blocked_by_user_id, blocked_user_id)
);

-- カレンダーテーブル
CREATE TABLE IF NOT EXISTS public.calendar_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- 誰のカレンダーか
  date DATE NOT NULL, -- 対象日
  has_posts BOOLEAN DEFAULT FALSE, -- その日に投稿があったか
  summary TEXT, -- 要約文（なければNULL）
  summary_status TEXT DEFAULT 'none' CHECK (summary_status IN ('none', 'manual', 'auto')), -- 要約ステータス
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE (owner_id, date) -- 同じユーザーの同じ日に複数レコード作らせない
);

-- リアルタイム機能を有効化
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;
-- room_settingsテーブル
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_settings;
-- roomsテーブル
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
-- room_messagesテーブル
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;

-- RLSの設定も更新
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でもチャットルームを読み取れる"
  ON public.rooms FOR SELECT
  USING (true);

CREATE POLICY "誰でもチャットルームを作成できる"
  ON public.rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "ログインユーザーのみチャットルームを更新できる"
  ON public.rooms FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_room_messages_owner_id_created_at
ON public.room_messages(owner_id, created_at);

-- auth.usersが作成されたとき、自動的にpublic.usersも作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url, recipient_id, created_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    -- _normalを削除して高解像度のプロフィール画像URLに変換
    REPLACE(COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''), '_normal', ''),
    NEW.raw_user_meta_data->>'sub',
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- public.usersレコード作成時にroom_settingsも自動的に作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.room_settings (user_id, created_at)
  VALUES (
    NEW.id, 
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーの作成または置換
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

DROP TRIGGER IF EXISTS on_user_created ON public.users;
CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_profile();

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- usersテーブルのupdated_atを自動更新
DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- room_settingsテーブルのupdated_atを自動更新
DROP TRIGGER IF EXISTS room_settings_updated_at ON public.room_settings;
CREATE TRIGGER room_settings_updated_at
  BEFORE UPDATE ON public.room_settings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- roomsテーブルのupdated_atを自動更新
DROP TRIGGER IF EXISTS rooms_updated_at ON public.rooms;
CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- RLSの設定
-- usersテーブルのRLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でもユーザー情報を閲覧できる"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "ユーザーは自分のユーザー情報を更新できる"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- room_settingsテーブルのRLS
ALTER TABLE public.room_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でもルーム設定を閲覧できる"
  ON public.room_settings FOR SELECT
  USING (true);

CREATE POLICY "ユーザーは自分のルーム設定を更新できる"
  ON public.room_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- room_messagesテーブルのRLS
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でもメッセージを読み取れる"
  ON public.room_messages FOR SELECT
  USING (true);

CREATE POLICY "誰でもメッセージを作成できる"
  ON public.room_messages FOR INSERT
  WITH CHECK (true);

drop policy if exists "誰でもメッセージを更新できる" on public.room_messages;

create policy "誰でもメッセージを更新できる"
  on public.room_messages for update
  using (true)
  with check (true);

