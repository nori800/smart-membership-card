import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証が必要なページ
  const protectedRoutes = ['/card', '/profile'];
  // 認証済みユーザーがアクセスできないページ（後でクライアント側で処理）
  const authRoutes = ['/login', '/register'];

  // APIルートやデバッグページは除外
  if (pathname.startsWith('/api') || pathname.startsWith('/debug') || pathname.startsWith('/test')) {
    return NextResponse.next();
  }

  // 認証が必要なページにアクセスしようとしている場合
  // セッション確認はクライアント側で行う
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // ここではリダイレクトせず、クライアント側で処理
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}; 