-- 認証ユーザーを手動で作成するSQL
-- 注意: これはSupabaseのSQL Editorでは実行できません
-- 代わりに、Supabaseダッシュボードの「Authentication」→「Users」で手動作成してください

-- 作成が必要なユーザー:
-- 1. yamada@example.com / member123
-- 2. tanaka@example.com / member123  
-- 3. sato@example.com / member123
-- 4. suzuki@example.com / member123

-- 手動作成手順:
-- 1. Supabaseダッシュボードを開く
-- 2. Authentication → Users
-- 3. 「Add user」をクリック
-- 4. Email: yamada@example.com, Password: member123, Email Confirm: ✅
-- 5. 「Create user」をクリック
-- 6. 同様に他のユーザーも作成

-- 作成後、以下のクエリで確認:
SELECT 
    au.id as auth_user_id,
    au.email,
    au.created_at,
    m.name,
    m.member_number,
    m.status
FROM auth.users au
LEFT JOIN members m ON au.id = m.auth_user_id
ORDER BY au.created_at; 