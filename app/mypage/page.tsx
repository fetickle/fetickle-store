'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// 環境変数から読み込む
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Purchase = {
  id: string
  purchased_at: string
  video: {
    title: string
    price: number
    video_url: string
    thumbnail_url: string
  }
}

export default function MyPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    const fetchPurchases = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('ユーザー取得失敗', userError)
        return
      }

      const { data, error } = await supabase
  .from('purchases')
  .select(`
    id,
    purchased_at,
    video:video_id (
      title,
      price,
      video_url,
      thumbnail_url
    )
  `)
  .eq('user_id', user.id)
  .order('purchased_at', { ascending: false })

  if (error) {
    console.error('購入履歴取得失敗', error)
  } else {
    setPurchases((data ?? []) as unknown as Purchase[])
  }
    }

    fetchPurchases()
  }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>🎥 購入済み動画</h1>
      <ul style={{ marginTop: 20 }}>
        {purchases.map((purchase) => (
          <li key={purchase.id} style={{ marginBottom: 40 }}>
            <strong>{purchase.video.title}</strong>（¥{purchase.video.price}）
            <br />
            <video controls width="320" src={purchase.video.video_url} style={{ marginTop: 10 }} />
            <p style={{ fontSize: 12, color: '#666' }}>
              購入日: {new Date(purchase.purchased_at).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
