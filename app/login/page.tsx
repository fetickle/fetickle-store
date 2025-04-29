'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    setMessage(error ? error.message : '登録用メールを確認してください')
  }

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMessage(error ? error.message : 'ログイン成功！')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setMessage('ログアウトしました')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>ログイン / ユーザー登録</h1>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <button onClick={signUp}>ユーザー登録</button>{' '}
      <button onClick={signIn}>ログイン</button>{' '}
      <button onClick={signOut}>ログアウト</button>
      <p>{message}</p>
    </div>
  )
}
