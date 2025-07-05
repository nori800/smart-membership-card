import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * デバッグ用: 会員データ確認API
 * @param request - リクエストオブジェクト
 * @returns 会員データ
 */
export async function GET(request: NextRequest) {
  try {
    console.log('=== Debug Members API Called ===');

    // 全会員データを取得（パスワードハッシュは除外）
    const { data: members, error } = await supabase
      .from('members')
      .select('id, name, email, member_number, status, expiration_date, is_active, created_at')
      .order('created_at');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          error: 'Database error',
          details: error.message 
        },
        { status: 500 }
      );
    }

    console.log('Found members:', members?.length || 0);
    
    // 特定のテストユーザーを検索
    const testUser = members?.find(m => m.email === 'yamada@example.com');
    console.log('Test user (yamada@example.com):', testUser ? 'FOUND' : 'NOT FOUND');

    return NextResponse.json({
      total_members: members?.length || 0,
      members: members || [],
      test_user_exists: !!testUser,
      test_user: testUser || null
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 