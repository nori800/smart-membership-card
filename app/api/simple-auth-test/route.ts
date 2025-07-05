import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    console.log('URL:', supabaseUrl);
    console.log('Service Role Key exists:', !!supabaseServiceRoleKey);
    console.log('Service Role Key length:', supabaseServiceRoleKey?.length);

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'test123456',
      email_confirm: true
    });

    console.log('Create user result:', { data, error });

    return NextResponse.json({
      url: supabaseUrl,
      keyExists: !!supabaseServiceRoleKey,
      keyLength: supabaseServiceRoleKey?.length,
      result: {
        success: !error,
        error: error?.message,
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email
        } : null
      }
    });

  } catch (error) {
    console.error('Simple auth test error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 