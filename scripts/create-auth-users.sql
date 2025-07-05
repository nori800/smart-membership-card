-- 既存の会員データに対応するSupabase認証ユーザーを作成
-- SupabaseのSQL Editorで実行してください

-- 1. 山田太郎のユーザーを作成
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  (SELECT id FROM members WHERE email = 'yamada@example.com'),
  '00000000-0000-0000-0000-000000000000',
  'yamada@example.com',
  crypt('member123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 2. 佐藤花子のユーザーを作成  
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  (SELECT id FROM members WHERE email = 'sato@example.com'),
  '00000000-0000-0000-0000-000000000000',
  'sato@example.com',
  crypt('member123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 3. 田中一郎のユーザーを作成
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  (SELECT id FROM members WHERE email = 'tanaka@example.com'),
  '00000000-0000-0000-0000-000000000000',
  'tanaka@example.com',
  crypt('member123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 4. 鈴木美咲のユーザーを作成
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  (SELECT id FROM members WHERE email = 'suzuki@example.com'),
  '00000000-0000-0000-0000-000000000000',
  'suzuki@example.com',
  crypt('member123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 5. 確認用クエリ
SELECT 
  u.email,
  u.email_confirmed_at,
  m.name,
  m.member_number,
  m.status
FROM auth.users u
JOIN members m ON u.id = m.id
WHERE u.email IN ('yamada@example.com', 'sato@example.com', 'tanaka@example.com', 'suzuki@example.com'); 