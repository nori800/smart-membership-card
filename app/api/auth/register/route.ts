import { NextRequest, NextResponse } from 'next/server';
import { registerMember } from '@/lib/auth';
import { memberRegistrationSchema } from '@/lib/validations';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

/**
 * 会員登録API
 * @param request - リクエストオブジェクト
 * @returns 登録結果
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = memberRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // 会員登録処理
    const member = await registerMember({
      name,
      email,
      password,
    });
    
    if (!member) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.SERVER_ERROR },
        { status: 500 }
      );
    }

    // 成功レスポンス（パスワードハッシュは除外）
    const { password_hash, ...memberData } = member;
    
    return NextResponse.json({
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      member: memberData,
    });

  } catch (error) {
    console.error('Registration API error:', error);
    
    // 重複エラーのハンドリング
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 