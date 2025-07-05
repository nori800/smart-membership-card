import { NextRequest, NextResponse } from 'next/server';
import { getMemberBenefits } from '@/lib/auth';
import { ERROR_MESSAGES } from '@/lib/constants';

/**
 * 会員特典取得API
 * @param request - リクエストオブジェクト
 * @returns 特典情報
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as 'bronze' | 'silver' | 'gold' | 'diamond';

    if (!status || !['bronze', 'silver', 'gold', 'diamond'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const benefits = await getMemberBenefits(status);
    
    return NextResponse.json({ benefits });

  } catch (error) {
    console.error('Benefits API error:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 