import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * 詳細な認証テスト用API
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Detailed Auth Test API Called ===');
    
    const body = await request.json();
    const { email = 'yamada@example.com', password = 'member123' } = body;

    console.log('Testing with email:', email);

    // 1. 環境変数確認
    const envCheck = {
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
      anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET'
    };

    console.log('Environment variables:', envCheck);

    // 2. 既存の認証ユーザーリストを取得
    console.log('2. Fetching existing auth users...');
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    console.log('Existing users result:');
    console.log('- Error:', usersError);
    console.log('- Users count:', usersData?.users?.length || 0);
    console.log('- Users:', usersData?.users?.map(u => ({ id: u.id, email: u.email, created_at: u.created_at })));

    // 3. 特定のユーザーが存在するかチェック
    const existingUser = usersData?.users?.find(u => u.email === email);
    console.log('Target user exists:', !!existingUser);

    // 4. 認証ユーザー作成を試行
    console.log('4. Attempting to create auth user...');
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: 'Test User',
        test: true
      }
    });

    console.log('Create user result:');
    console.log('- Error:', createError);
    console.log('- User created:', createData?.user ? {
      id: createData.user.id,
      email: createData.user.email,
      created_at: createData.user.created_at
    } : null);

    // 5. 作成後の認証ユーザーリストを再取得
    console.log('5. Fetching users after creation...');
    const { data: afterUsersData, error: afterUsersError } = await supabaseAdmin.auth.admin.listUsers();
    
    console.log('After creation users result:');
    console.log('- Error:', afterUsersError);
    console.log('- Users count:', afterUsersData?.users?.length || 0);

    return NextResponse.json({
      env_check: envCheck,
      existing_users: {
        error: usersError?.message,
        count: usersData?.users?.length || 0,
        users: usersData?.users?.map(u => ({ id: u.id, email: u.email, created_at: u.created_at })) || []
      },
      target_user_exists: !!existingUser,
      create_attempt: {
        error: createError?.message,
        success: !createError,
        user: createData?.user ? {
          id: createData.user.id,
          email: createData.user.email,
          created_at: createData.user.created_at
        } : null
      },
      after_creation: {
        error: afterUsersError?.message,
        count: afterUsersData?.users?.length || 0
      }
    });

  } catch (error) {
    console.error('Detailed auth test error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 