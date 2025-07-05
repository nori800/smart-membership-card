import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/auth';

/**
 * デバッグ用: パスワード検証API
 * @param request - リクエストオブジェクト
 * @returns パスワード検証結果
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Debug Password API Called ===');
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Testing password for email:', email);

    // ユーザーを取得
    const { data: member, error } = await supabase
      .from('members')
      .select('id, email, password_hash, name, member_number')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        found: false,
        error: error.message
      });
    }

    if (!member) {
      console.log('Member not found');
      return NextResponse.json({
        found: false,
        error: 'Member not found'
      });
    }

    console.log('Found member:', {
      id: member.id,
      email: member.email,
      name: member.name,
      member_number: member.member_number
    });

    // パスワード検証
    const isValid = await verifyPassword(password, member.password_hash);
    console.log('Password verification result:', isValid);

    return NextResponse.json({
      found: true,
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        member_number: member.member_number
      },
      password_valid: isValid,
      hash_length: member.password_hash.length,
      hash_starts_with: member.password_hash.substring(0, 10) + '...'
    });

  } catch (error) {
    console.error('Debug password API error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 