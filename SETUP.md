# 🗄️ Supabase データベースセットアップ手順

## 📋 前提条件

- [Supabase](https://supabase.com/) のアカウント作成済み
- Supabaseプロジェクトの作成済み

---

## 🚀 セットアップ手順

### 1. 環境変数の設定

`.env.local` ファイルを作成し、以下の内容を設定してください：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=デジタル会員証システム
NEXT_PUBLIC_ORGANIZATION_NAME=大分県音楽教会
```

**取得方法：**
1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「API」から以下をコピー：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. データベーススキーマの作成

Supabaseダッシュボードで以下の手順を実行：

1. **SQL Editor** を開く
2. `lib/database.sql` の内容をコピー
3. SQL Editorに貼り付けて実行

**実行順序：**
```sql
-- 1. ENUMSの作成
CREATE TYPE member_status AS ENUM ('bronze', 'silver', 'gold', 'diamond');
CREATE TYPE login_type AS ENUM ('web', 'mobile');

-- 2. TABLESの作成
-- (members, member_benefits, admins, login_logs)

-- 3. INDEXESの作成
-- (パフォーマンス向上のため)

-- 4. TRIGGERSの作成
-- (updated_at自動更新)

-- 5. RLS (Row Level Security)の設定
-- (セキュリティポリシー)

-- 6. FUNCTIONSの作成
-- (会員番号生成、特典取得)

-- 7. SAMPLE DATAの挿入
-- (テスト用データ)
```

### 3. 接続テストの実行

環境変数を設定後、以下の手順で接続をテストしてください：

1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

2. **テストページにアクセス**
   - ブラウザで `http://localhost:3000/test` を開く
   - 接続状況を確認

3. **エラーが発生した場合**
   - 環境変数が正しく設定されているか確認
   - 開発サーバーを再起動
   - Supabaseプロジェクトの状態を確認

### 4. サンプルデータの確認

以下のサンプルデータが作成されていることを確認：

**会員データ（パスワード: member123）**
- 山田太郎 (yamada@example.com) - ダイヤモンド会員 (M-2025-0001)
- 佐藤花子 (sato@example.com) - ゴールド会員 (M-2025-0002)
- 田中一郎 (tanaka@example.com) - シルバー会員 (M-2025-0003)
- 鈴木二郎 (suzuki@example.com) - ブロンズ会員 (M-2025-0004)

**管理者データ（パスワード: admin123）**
- admin@piano.or.jp

**会員特典データ**
- ブロンズ: 5%割引
- シルバー: 10%割引
- ゴールド: 15%割引
- ダイヤモンド: 20%割引

---

## 🔧 開発環境での動作確認

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

### 3. 動作テスト

1. **接続テスト** (`http://localhost:3000/test`) - Supabase接続確認
2. **ホームページ** (`http://localhost:3000`) - ランディングページ
3. **ログイン** (`/login`) - サンプル会員でテスト
4. **会員証表示** (`/card`) - 会員情報と特典の表示確認
5. **プロフィール編集** (`/profile`) - 情報更新機能の確認

---

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. **環境変数エラー**
```
Error: Missing NEXT_PUBLIC_SUPABASE_URL environment variable
```

**解決方法：**
- `.env.local` ファイルがプロジェクトルートに存在することを確認
- 環境変数の値が正しく設定されているか確認
- 開発サーバーを再起動 (`Ctrl+C` → `npm run dev`)

#### 2. **Supabase接続エラー**
```
Supabase connection test failed
```

**解決方法：**
- Supabaseプロジェクトが正常に動作しているか確認
- APIキーが正しいか確認
- ネットワーク接続を確認

#### 3. **データベーステーブルが見つからない**
```
relation "members" does not exist
```

**解決方法：**
- `lib/database.sql` の内容をSupabase SQL Editorで実行
- テーブルが正しく作成されているかSupabaseダッシュボードで確認

#### 4. **RLS (Row Level Security) エラー**
```
new row violates row-level security policy
```

**解決方法：**
- RLSポリシーが正しく設定されているか確認
- 認証状態を確認
- 必要に応じてポリシーを調整

### デバッグ方法

1. **接続テストページを使用**
   ```
   http://localhost:3000/test
   ```

2. **ブラウザの開発者ツールでログを確認**
   - F12 → Console タブ
   - Network タブでAPIリクエストを確認

3. **Supabaseダッシュボードでログを確認**
   - Supabase → プロジェクト → Logs

---

## 📊 データベース構造

### テーブル一覧

| テーブル名 | 説明 | 主要カラム |
|------------|------|------------|
| `members` | 会員情報 | id, name, email, member_number, status |
| `member_benefits` | 会員特典 | status, title, description, discount_rate |
| `admins` | 管理者 | id, email, name |
| `login_logs` | ログイン履歴 | member_id, ip_address, login_type |

### 会員ステータス

| ステータス | 表示名 | デフォルト特典 |
|------------|--------|----------------|
| `bronze` | ブロンズ | 5%割引 |
| `silver` | シルバー | 10%割引 |
| `gold` | ゴールド | 15%割引 |
| `diamond` | ダイヤモンド | 20%割引 |

---

## 🔐 セキュリティ設定

### パスワードハッシュ化
- **bcryptjs** を使用
- **Salt rounds: 10**

### Row Level Security (RLS)
- 各テーブルでRLSが有効
- 適切なアクセス制御ポリシーを設定

### 環境変数保護
- `.env.local` はGitに含まれない
- 本番環境では適切な環境変数管理を実施

---

## 📝 次のステップ

1. **管理者機能の実装**
2. **CSV一括登録機能**
3. **本番環境へのデプロイ**
4. **セキュリティ監査**

---

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. [Supabase公式ドキュメント](https://supabase.com/docs)
2. 接続テストページ (`/test`) の結果
3. ブラウザの開発者ツールのエラーログ
4. Supabaseダッシュボードのログ

---

## 🎯 クイックスタート

**初回セットアップ時に実行するコマンド：**

```bash
# 1. 依存関係のインストール
npm install

# 2. 環境変数ファイルの作成
# .env.local ファイルを作成し、Supabase情報を設定

# 3. 開発サーバーの起動
npm run dev

# 4. 接続テスト
# http://localhost:3000/test にアクセス
```

**毎回の開発時：**

```bash
# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
``` 