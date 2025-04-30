import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Supabaseクライアントを作成（Cookieベース認証）
  const supabase = createMiddlewareClient({ req, res })

  // セッションを取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // ✅ ログインしていなければ /login にリダイレクト
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ✅ ログイン済みならそのまま進める
  return res
}

// ✅ middleware を適用するルート（login, api, staticファイルなどは除外）
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}
