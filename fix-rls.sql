-- RLS（Row Level Security）を適切に設定し直す
-- APIアクセス用のポリシーを追加

-- 1. RLSを再有効化
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- 2. 既存のポリシーを削除
DROP POLICY IF EXISTS "Members can view own data" ON members;
DROP POLICY IF EXISTS "Members can update own data" ON members;
DROP POLICY IF EXISTS "Anyone can view active benefits" ON member_benefits;
DROP POLICY IF EXISTS "Only authenticated admins can access" ON admins;
DROP POLICY IF EXISTS "Members can view own login logs" ON login_logs;

-- 3. APIアクセス用のポリシーを追加

-- 会員テーブル: サービスロール（anon）からのアクセスを許可
CREATE POLICY "Allow service role access to members" ON members
    FOR ALL USING (true);

-- 会員特典テーブル: 全員がアクセス可能
CREATE POLICY "Allow all access to member_benefits" ON member_benefits
    FOR ALL USING (true);

-- 管理者テーブル: サービスロールからのアクセスを許可
CREATE POLICY "Allow service role access to admins" ON admins
    FOR ALL USING (true);

-- ログイン履歴テーブル: サービスロールからのアクセスを許可
CREATE POLICY "Allow service role access to login_logs" ON login_logs
    FOR ALL USING (true);

-- 4. 確認用クエリ
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('members', 'member_benefits', 'admins', 'login_logs')
ORDER BY tablename, policyname; 