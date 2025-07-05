import { NextRequest, NextResponse } from 'next/server';
import { loginMember } from '@/lib/auth';
import { memberLoginSchema } from '@/lib/validations';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

// APIルートを動的レンダリングに強制
export const dynamic = 'force-dynamic';

/**
 * 会員ログインAPI
 * @param request - リクエストオブジェクト
 * @returns ログイン結果
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Login API Called ===');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    // バリデーション
    const validationResult = memberLoginSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.issues);
      return NextResponse.json(
        { 
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { identifier, password } = validationResult.data;
    console.log('Validated input:', { identifier, password: '***' });

    // ログイン処理
    console.log('Attempting login...');
    const member = await loginMember(identifier, password);
    console.log('Login result:', member ? 'SUCCESS' : 'FAILED');
    
    if (!member) {
      console.log('Login failed - member not found or invalid credentials');
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    // 成功レスポンス（パスワードハッシュは除外）
    const { password_hash, ...memberData } = member;
    console.log('Login successful for member:', memberData.email);
    
    return NextResponse.json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      member: memberData,
    });

  } catch (error) {
    console.error('Login API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: ERROR_MESSAGES.SERVER_ERROR,
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
} 