-- 一時的にRLSを無効化して認証ユーザー作成をテスト
-- 注意: これは開発環境でのみ実行してください

-- 1. membersテーブルのRLSを一時的に無効化
ALTER TABLE members DISABLE ROW LEVEL SECURITY;

-- 2. 現在のポリシーを確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'members';

-- 3. 全てのポリシーを一時的に削除
DROP POLICY IF EXISTS "Users can view their own member data" ON members;
DROP POLICY IF EXISTS "Users can update their own member data" ON members;
DROP POLICY IF EXISTS "Admins can access all member data" ON members;
DROP POLICY IF EXISTS "Enable read access for all users" ON members;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON members;
DROP POLICY IF EXISTS "Enable update for users based on email" ON members;

-- 4. 確認用: 現在のmembersテーブルの状態
SELECT 
    id, 
    name, 
    email, 
    member_number, 
    status, 
    auth_user_id,
    is_active
FROM members
ORDER BY created_at;

-- 注意: 認証ユーザー作成後は必ずRLSを再有効化してください
-- ALTER TABLE members ENABLE ROW LEVEL SECURITY; 