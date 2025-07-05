import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Supabase認証ユーザーを作成し、既存のmembersテーブルと紐付ける
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Create Auth User API Called ===');
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Creating auth user for email:', email);

    // 1. 既存のmembersテーブルから該当ユーザーを検索
    console.log('1. Checking existing member...');
    const { data: existingMember, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('email', email)
      .single();

    if (memberError && memberError.code !== 'PGRST116') {
      console.error('Error checking member:', memberError);
      return NextResponse.json(
        { error: 'Database error while checking member' },
        { status: 500 }
      );
    }

    if (!existingMember) {
      console.log('Member not found in members table');
      return NextResponse.json(
        { error: 'Member not found in database' },
        { status: 404 }
      );
    }

    console.log('Found existing member:', {
      id: existingMember.id,
      email: existingMember.email,
      name: existingMember.name,
      member_number: existingMember.member_number
    });

    // 2. Supabase認証ユーザーを作成
    console.log('2. Creating Supabase auth user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // メール確認を自動的に完了
      user_metadata: {
        name: existingMember.name,
        member_number: existingMember.member_number,
        member_id: existingMember.id
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: `Failed to create auth user: ${authError.message}` },
        { status: 500 }
      );
    }

    console.log('Auth user created successfully:', {
      id: authData.user.id,
      email: authData.user.email
    });

    // 3. membersテーブルにauth_user_idを追加（カラムがある場合）
    console.log('3. Updating member with auth_user_id...');
    const { error: updateError } = await supabase
      .from('members')
      .update({ 
        auth_user_id: authData.user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingMember.id);

    if (updateError) {
      console.error('Error updating member with auth_user_id:', updateError);
      // 認証ユーザーは作成されているので、警告として処理
      console.warn('Auth user created but failed to update member table');
    }

    return NextResponse.json({
      success: true,
      message: 'Auth user created and linked successfully',
      auth_user: {
        id: authData.user.id,
        email: authData.user.email,
        created_at: authData.user.created_at
      },
      member: {
        id: existingMember.id,
        name: existingMember.name,
        email: existingMember.email,
        member_number: existingMember.member_number
      }
    });

  } catch (error) {
    console.error('Create auth user API error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 