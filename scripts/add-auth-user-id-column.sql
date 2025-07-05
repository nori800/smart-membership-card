-- membersテーブルにauth_user_idカラムを追加
-- Supabase認証ユーザーとmembersテーブルを紐付けるため

-- 1. auth_user_idカラムを追加（既に存在する場合はスキップ）
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'members' 
                   AND column_name = 'auth_user_id') THEN
        ALTER TABLE members ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
        RAISE NOTICE 'auth_user_id column added to members table';
    ELSE
        RAISE NOTICE 'auth_user_id column already exists in members table';
    END IF;
END $$;

-- 2. auth_user_idにインデックスを作成（既に存在する場合はスキップ）
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                   WHERE tablename = 'members' 
                   AND indexname = 'idx_members_auth_user_id') THEN
        CREATE INDEX idx_members_auth_user_id ON members(auth_user_id);
        RAISE NOTICE 'Index created on members.auth_user_id';
    ELSE
        RAISE NOTICE 'Index already exists on members.auth_user_id';
    END IF;
END $$;

-- 3. RLSポリシーを更新（認証ユーザーが自分のレコードのみアクセス可能）
DROP POLICY IF EXISTS "Users can view their own member data" ON members;
DROP POLICY IF EXISTS "Users can update their own member data" ON members;

-- 認証ユーザーが自分のmemberデータを参照できるポリシー
CREATE POLICY "Users can view their own member data" ON members
    FOR SELECT USING (auth.uid() = auth_user_id);

-- 認証ユーザーが自分のmemberデータを更新できるポリシー
CREATE POLICY "Users can update their own member data" ON members
    FOR UPDATE USING (auth.uid() = auth_user_id);

-- 管理者は全てのmemberデータにアクセス可能
CREATE POLICY "Admins can access all member data" ON members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE admins.auth_user_id = auth.uid()
        )
    );

COMMIT; 