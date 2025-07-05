-- デジタル会員証システム データベース設計
-- 実行順序: 1. Enums → 2. Tables → 3. RLS → 4. Functions → 5. Sample Data

-- ==========================================
-- 1. ENUMS (列挙型)
-- ==========================================

-- 会員ステータス
CREATE TYPE member_status AS ENUM ('bronze', 'silver', 'gold', 'diamond');

-- ログインタイプ
CREATE TYPE login_type AS ENUM ('web', 'mobile');

-- ==========================================
-- 2. TABLES (テーブル)
-- ==========================================

-- 会員テーブル
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    member_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status member_status DEFAULT 'bronze',
    expiration_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 会員特典テーブル
CREATE TABLE member_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status member_status NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    discount_rate DECIMAL(5,2) NULL, -- 割引率（例: 10.00 = 10%）
    is_active BOOLEAN DEFAULT TRUE
);

-- 管理者テーブル
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- ログイン履歴テーブル
CREATE TABLE login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    login_type login_type DEFAULT 'web'
);

-- ==========================================
-- 3. INDEXES (インデックス)
-- ==========================================

-- 会員テーブルのインデックス
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_member_number ON members(member_number);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_is_active ON members(is_active);

-- 会員特典テーブルのインデックス
CREATE INDEX idx_member_benefits_status ON member_benefits(status);
CREATE INDEX idx_member_benefits_is_active ON member_benefits(is_active);

-- 管理者テーブルのインデックス
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_is_active ON admins(is_active);

-- ログイン履歴テーブルのインデックス
CREATE INDEX idx_login_logs_member_id ON login_logs(member_id);
CREATE INDEX idx_login_logs_created_at ON login_logs(created_at);

-- ==========================================
-- 4. TRIGGERS (トリガー)
-- ==========================================

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにupdated_atトリガーを設定
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_benefits_updated_at 
    BEFORE UPDATE ON member_benefits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON admins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- 会員テーブルのRLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 会員は自分のデータのみ参照・更新可能
CREATE POLICY "Members can view own data" ON members
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Members can update own data" ON members
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 会員特典テーブルのRLS
ALTER TABLE member_benefits ENABLE ROW LEVEL SECURITY;

-- 会員特典は全員が参照可能
CREATE POLICY "Anyone can view active benefits" ON member_benefits
    FOR SELECT USING (is_active = true);

-- 管理者テーブルのRLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 管理者は認証済みユーザーのみアクセス可能
CREATE POLICY "Only authenticated admins can access" ON admins
    FOR ALL USING (auth.role() = 'authenticated');

-- ログイン履歴テーブルのRLS
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- 会員は自分のログイン履歴のみ参照可能
CREATE POLICY "Members can view own login logs" ON login_logs
    FOR SELECT USING (auth.uid()::text = member_id::text);

-- ==========================================
-- 6. SAMPLE DATA (サンプルデータ)
-- ==========================================

-- 会員特典のサンプルデータ
INSERT INTO member_benefits (status, title, description, discount_rate, is_active) VALUES
('bronze', 'ブロンズ会員特典', '基本的な会員特典をご利用いただけます', 5.00, true),
('silver', 'シルバー会員特典', '中級会員として追加特典をご利用いただけます', 10.00, true),
('gold', 'ゴールド会員特典', '上級会員として豊富な特典をご利用いただけます', 15.00, true),
('diamond', 'ダイヤモンド会員特典', 'プレミアム会員として最高レベルの特典をご利用いただけます', 20.00, true);

-- 管理者のサンプルデータ（パスワード: admin123）
INSERT INTO admins (email, password_hash, name, is_active) VALUES
('admin@piano.or.jp', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '管理者', true);

-- 会員のサンプルデータ（パスワード: member123）
INSERT INTO members (name, email, member_number, password_hash, status, expiration_date, is_active) VALUES
('山田太郎', 'yamada@example.com', 'M-2025-0001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'diamond', '2026-03-31', true),
('佐藤花子', 'sato@example.com', 'M-2025-0002', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gold', '2026-03-31', true),
('田中一郎', 'tanaka@example.com', 'M-2025-0003', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'silver', '2026-03-31', true),
('鈴木二郎', 'suzuki@example.com', 'M-2025-0004', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'bronze', '2026-03-31', true);

-- ==========================================
-- 7. FUNCTIONS (関数)
-- ==========================================

-- 会員番号自動生成関数
CREATE OR REPLACE FUNCTION generate_member_number()
RETURNS TEXT AS $$
DECLARE
    year_str TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    next_num INTEGER;
    member_number TEXT;
BEGIN
    -- 今年の最大会員番号を取得
    SELECT COALESCE(MAX(
        CASE 
            WHEN member_number ~ ('^M-' || year_str || '-[0-9]+$') 
            THEN SUBSTRING(member_number FROM LENGTH('M-' || year_str || '-') + 1)::INTEGER
            ELSE 0
        END
    ), 0) + 1 INTO next_num
    FROM members;
    
    -- 会員番号を生成（例: M-2025-0001）
    member_number := 'M-' || year_str || '-' || LPAD(next_num::TEXT, 4, '0');
    
    RETURN member_number;
END;
$$ LANGUAGE plpgsql;

-- 会員ステータスに応じた特典取得関数
CREATE OR REPLACE FUNCTION get_member_benefits(member_status_param member_status)
RETURNS TABLE (
    title TEXT,
    description TEXT,
    discount_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mb.title,
        mb.description,
        mb.discount_rate
    FROM member_benefits mb
    WHERE mb.status = member_status_param 
    AND mb.is_active = true
    ORDER BY mb.created_at;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 8. COMMENTS (コメント)
-- ==========================================

COMMENT ON TABLE members IS '会員情報テーブル';
COMMENT ON COLUMN members.member_number IS '会員番号（例: M-2025-0001）';
COMMENT ON COLUMN members.status IS '会員ステータス（bronze, silver, gold, diamond）';
COMMENT ON COLUMN members.expiration_date IS '会員証有効期限';

COMMENT ON TABLE member_benefits IS '会員特典テーブル';
COMMENT ON COLUMN member_benefits.discount_rate IS '割引率（%）';

COMMENT ON TABLE admins IS '管理者テーブル';
COMMENT ON TABLE login_logs IS 'ログイン履歴テーブル'; 