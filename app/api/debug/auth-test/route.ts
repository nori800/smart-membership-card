import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { signInWithEmail } from '@/lib/auth-supabase';

/**
 * デバッグ用: 新しい認証システムのテストAPI
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Auth Test API Called ===');
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Testing auth for email:', email);

    // 1. Supabase認証を直接テスト
    console.log('1. Testing direct Supabase auth...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Direct auth result:');
    console.log('- Error:', authError);
    console.log('- User:', authData.user ? {
      id: authData.user.id,
      email: authData.user.email,
      confirmed_at: authData.user.email_confirmed_at
    } : null);
    console.log('- Session:', authData.session ? 'EXISTS' : 'NULL');

    // 2. membersテーブルを確認
    console.log('2. Checking members table...');
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('*')
      .eq('email', email);

    console.log('Members query result:');
    console.log('- Error:', membersError);
    console.log('- Members found:', members?.length || 0);
    console.log('- Members:', members);

    // 3. signInWithEmail関数をテスト
    console.log('3. Testing signInWithEmail function...');
    const signInResult = await signInWithEmail(email, password);
    console.log('SignIn function result:', signInResult);

    // 4. 現在のユーザーセッションを確認
    console.log('4. Checking current user session...');
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    console.log('Current user result:');
    console.log('- Error:', userError);
    console.log('- User:', currentUser ? {
      id: currentUser.id,
      email: currentUser.email,
      confirmed_at: currentUser.email_confirmed_at
    } : null);

    return NextResponse.json({
      direct_auth: {
        success: !authError,
        error: authError?.message,
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          confirmed_at: authData.user.email_confirmed_at
        } : null,
        has_session: !!authData.session
      },
      members_table: {
        error: membersError?.message,
        count: members?.length || 0,
        members: members
      },
      signin_function: signInResult,
      current_user: {
        error: userError?.message,
        user: currentUser ? {
          id: currentUser.id,
          email: currentUser.email,
          confirmed_at: currentUser.email_confirmed_at
        } : null
      }
    });

  } catch (error) {
    console.error('Auth test API error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 