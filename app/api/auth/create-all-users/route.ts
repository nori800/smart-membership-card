import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * 既存のmembersテーブルの全ユーザーに対してSupabase認証ユーザーを一括作成
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Create All Auth Users API Called ===');
    
    const body = await request.json();
    const { defaultPassword = 'member123' } = body;

    // 1. 全てのmembersを取得
    console.log('1. Fetching all members...');
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('*')
      .eq('is_active', true);

    if (membersError) {
      console.error('Error fetching members:', membersError);
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      );
    }

    console.log(`Found ${members?.length || 0} active members`);

    const results = [];
    const errors = [];

    // 2. 各メンバーに対してauth userを作成
    for (const member of members || []) {
      try {
        console.log(`Creating auth user for: ${member.email}`);

        // 既存のauth userがあるかチェック
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const userExists = existingUser.users.find(u => u.email === member.email);
        
        if (userExists) {
          console.log(`Auth user already exists for: ${member.email}`);
          results.push({
            email: member.email,
            status: 'already_exists',
            auth_user_id: userExists.id
          });
          continue;
        }

        // auth userを作成
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: member.email,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            name: member.name,
            member_number: member.member_number,
            member_id: member.id
          }
        });

        if (authError) {
          console.error(`Error creating auth user for ${member.email}:`, authError);
          errors.push({
            email: member.email,
            error: authError.message
          });
          continue;
        }

        // membersテーブルを更新
        const { error: updateError } = await supabase
          .from('members')
          .update({ 
            auth_user_id: authData.user.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', member.id);

        if (updateError) {
          console.warn(`Failed to update member ${member.email} with auth_user_id:`, updateError);
        }

        results.push({
          email: member.email,
          status: 'created',
          auth_user_id: authData.user.id,
          member_id: member.id
        });

        console.log(`Successfully created auth user for: ${member.email}`);

      } catch (error) {
        console.error(`Error processing member ${member.email}:`, error);
        errors.push({
          email: member.email,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${members?.length || 0} members`,
      results: {
        total: members?.length || 0,
        created: results.filter(r => r.status === 'created').length,
        already_exists: results.filter(r => r.status === 'already_exists').length,
        errors: errors.length
      },
      details: results,
      errors: errors
    });

  } catch (error) {
    console.error('Create all auth users API error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 