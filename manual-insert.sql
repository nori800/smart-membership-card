-- 手動テストデータ挿入用SQL
-- SupabaseのSQL Editorで実行してください

-- 1. 会員データの挿入（パスワード: member123）
INSERT INTO members (name, email, member_number, password_hash, status, expiration_date, is_active) VALUES
('山田太郎', 'yamada@example.com', 'M-2025-0001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'diamond', '2026-03-31', true);

-- 2. 確認用クエリ
SELECT * FROM members WHERE email = 'yamada@example.com'; 