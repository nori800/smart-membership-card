import { NextRequest, NextResponse } from 'next/server';
import { getMember, updateMember, verifyPassword, hashPassword } from '@/lib/auth';
import { memberUpdateSchema } from '@/lib/validations';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

// APIルートを動的レンダリングに強制
export const dynamic = 'force-dynamic';

/**
 * 会員情報取得API
 * @param request - リクエストオブジェクト
 * @returns 会員情報
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const member = await getMember(memberId);
    if (!member) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MEMBER_NOT_FOUND },
        { status: 404 }
      );
    }

    // パスワードハッシュは除外
    const { password_hash, ...memberData } = member;
    
    return NextResponse.json({ member: memberData });

  } catch (error) {
    console.error('Get profile API error:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}

/**
 * 会員情報更新API
 * @param request - リクエストオブジェクト
 * @returns 更新結果
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = memberUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { memberId, ...updateData } = body;
    
    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // 現在の会員情報を取得
    const currentMember = await getMember(memberId);
    if (!currentMember) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MEMBER_NOT_FOUND },
        { status: 404 }
      );
    }

    // パスワード変更の処理
    let updates: any = {};
    
    if (updateData.name) {
      updates.name = updateData.name;
    }
    
    if (updateData.email) {
      updates.email = updateData.email;
    }

    // パスワード変更時の処理
    if (updateData.currentPassword && updateData.newPassword) {
      // 現在のパスワードを検証
      const isValidPassword = await verifyPassword(
        updateData.currentPassword,
        currentMember.password_hash
      );
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: '現在のパスワードが間違っています' },
          { status: 400 }
        );
      }

      // 新しいパスワードをハッシュ化
      updates.password_hash = await hashPassword(updateData.newPassword);
    }

    // 更新実行
    const success = await updateMember(memberId, updates);
    if (!success) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.SERVER_ERROR },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
    });

  } catch (error) {
    console.error('Update profile API error:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 