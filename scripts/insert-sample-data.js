const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// 環境変数の読み込み
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('環境変数が設定されていません');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

// Service Role Keyでクライアントを作成（RLSをバイパス）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertSampleData() {
  try {
    console.log('=== サンプルデータの挿入開始 ===');

    // パスワードハッシュ化
    const memberPasswordHash = await bcrypt.hash('member123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // 1. 会員データの挿入
    console.log('1. 会員データを挿入中...');
    const { data: members, error: membersError } = await supabase
      .from('members')
      .insert([
        {
          name: '山田太郎',
          email: 'yamada@example.com',
          member_number: 'M2024001',
          password_hash: memberPasswordHash,
          status: 'bronze',
          expiration_date: '2025-12-31',
          is_active: true,
        },
        {
          name: '佐藤花子',
          email: 'sato@example.com',
          member_number: 'M2024002',
          password_hash: memberPasswordHash,
          status: 'silver',
          expiration_date: '2025-12-31',
          is_active: true,
        },
        {
          name: '田中一郎',
          email: 'tanaka@example.com',
          member_number: 'M2024003',
          password_hash: memberPasswordHash,
          status: 'gold',
          expiration_date: '2025-12-31',
          is_active: true,
        },
        {
          name: '鈴木美咲',
          email: 'suzuki@example.com',
          member_number: 'M2024004',
          password_hash: memberPasswordHash,
          status: 'diamond',
          expiration_date: '2025-12-31',
          is_active: true,
        },
      ])
      .select();

    if (membersError) {
      console.error('会員データ挿入エラー:', membersError);
    } else {
      console.log('会員データ挿入成功:', members.length, '件');
    }

    // 2. 管理者データの挿入
    console.log('2. 管理者データを挿入中...');
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .insert([
        {
          name: '管理者',
          email: 'admin@piano.or.jp',
          password_hash: adminPasswordHash,
          is_active: true,
        },
      ])
      .select();

    if (adminsError) {
      console.error('管理者データ挿入エラー:', adminsError);
    } else {
      console.log('管理者データ挿入成功:', admins.length, '件');
    }

    // 3. 会員特典データの挿入
    console.log('3. 会員特典データを挿入中...');
    const { data: benefits, error: benefitsError } = await supabase
      .from('member_benefits')
      .insert([
        {
          status: 'bronze',
          title: 'ブロンズ特典',
          description: 'コンサートチケット5%割引',
          discount_rate: 5,
          is_active: true,
        },
        {
          status: 'silver',
          title: 'シルバー特典',
          description: 'コンサートチケット10%割引、楽譜購入5%割引',
          discount_rate: 10,
          is_active: true,
        },
        {
          status: 'gold',
          title: 'ゴールド特典',
          description: 'コンサートチケット15%割引、楽譜購入10%割引、マスタークラス参加権',
          discount_rate: 15,
          is_active: true,
        },
        {
          status: 'diamond',
          title: 'ダイヤモンド特典',
          description: 'コンサートチケット20%割引、楽譜購入15%割引、マスタークラス優先参加権、VIP席確保',
          discount_rate: 20,
          is_active: true,
        },
      ])
      .select();

    if (benefitsError) {
      console.error('特典データ挿入エラー:', benefitsError);
    } else {
      console.log('特典データ挿入成功:', benefits.length, '件');
    }

    console.log('=== サンプルデータの挿入完了 ===');
    console.log('');
    console.log('テストアカウント情報:');
    console.log('会員ログイン - yamada@example.com / member123');
    console.log('管理者ログイン - admin@piano.or.jp / admin123');

  } catch (error) {
    console.error('データ挿入エラー:', error);
  }
}

insertSampleData(); 