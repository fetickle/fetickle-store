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

  console.log('✅ セッション:', session)

  // セッションがなければログインにリダイレクト
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

// 適用ルート（login, favicon, static, image, api 以外）
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}
