import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

// APIルートを動的レンダリングに強制
export const dynamic = 'force-dynamic';

/**
 * 新規会員登録API
 * 1. Supabase Authにユーザーを作成
 * 2. membersテーブルに会員情報を保存
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Register API Called ===');
    
    const body = await request.json();
    const { name, email, password, status } = body;

    // バリデーション
    if (!name || !email || !password || !status) {
      return NextResponse.json(
        { error: '全ての項目を入力してください' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'パスワードは6文字以上で入力してください' },
        { status: 400 }
      );
    }

    const validStatuses = ['bronze', 'silver', 'gold', 'diamond'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '有効なステータスを選択してください' },
        { status: 400 }
      );
    }

    console.log('Creating user for:', { name, email, status });

    // 1. 既存のメールアドレスをチェック
    const { data: existingMember } = await supabase
      .from('members')
      .select('email')
      .eq('email', email)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // 2. Supabase Authにユーザーを作成
    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name,
        status: status
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      return NextResponse.json(
        { error: `認証ユーザーの作成に失敗しました: ${authError.message}` },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: '認証ユーザーの作成に失敗しました' },
        { status: 500 }
      );
    }

    console.log('Auth user created:', authData.user.id);

    // 3. 会員番号を生成
    const memberNumber = `M-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    // 4. membersテーブルに会員情報を保存
    console.log('Creating member record...');
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .insert({
        auth_user_id: authData.user.id,
        name: name,
        email: email,
        member_number: memberNumber,
        password_hash: 'supabase_auth', // Supabase認証を使用するためダミー値
        status: status,
        expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_active: true
      })
      .select()
      .single();

    if (memberError) {
      console.error('Member creation error:', memberError);
      
      // 認証ユーザーは作成されているので、ロールバックを試行
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        console.log('Rolled back auth user creation');
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }

      return NextResponse.json(
        { error: `会員情報の作成に失敗しました: ${memberError.message}` },
        { status: 500 }
      );
    }

    console.log('Member created successfully:', memberData);

    return NextResponse.json({
      success: true,
      message: '会員登録が完了しました',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
        status: status,
        member_number: memberNumber
      }
    });

  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 