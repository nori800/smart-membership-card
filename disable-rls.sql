-- RLS（Row Level Security）を一時的に無効化
-- テスト用です。本番環境では使用しないでください。

-- 1. 全テーブルのRLSを無効化
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE member_benefits DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs DISABLE ROW LEVEL SECURITY;

-- 2. 確認用クエリ
SELECT 'members' as table_name, count(*) as row_count FROM members
UNION ALL
SELECT 'member_benefits' as table_name, count(*) as row_count FROM member_benefits
UNION ALL
SELECT 'admins' as table_name, count(*) as row_count FROM admins
UNION ALL
SELECT 'login_logs' as table_name, count(*) as row_count FROM login_logs; 