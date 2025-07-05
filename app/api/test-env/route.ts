import { NextRequest, NextResponse } from 'next/server';

/**
 * 環境変数のテスト用API
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    return NextResponse.json({
      env_check: {
        supabase_url: supabaseUrl ? 'SET' : 'NOT_SET',
        anon_key: supabaseAnonKey ? 'SET' : 'NOT_SET',
        service_role_key: supabaseServiceRoleKey ? 'SET' : 'NOT_SET'
      },
      urls: {
        supabase_url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT_SET'
      }
    });

  } catch (error) {
    console.error('Environment test error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 