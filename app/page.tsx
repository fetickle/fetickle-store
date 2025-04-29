'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

// Supabase クライアントを作成
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Video = {
  id: string
  title: string
  price: number
  video_url: string
  thumbnail_url: string
  is_published: boolean
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const handlePurchase = async (videoId: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('ログインユーザーが取得できませんでした')
      return
    }
  
    const { error } = await supabase.from('purchases').insert({
      user_id: user.id,
      video_id: videoId,
    })
  
    if (error) {
      console.error('購入処理に失敗しました', error)
    } else {
      alert('購入が完了しました！')
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('取得失敗:', error)
      } else {
        setVideos(data || [])
      }
    }

    fetchData()
  }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>🎬 動画一覧</h1>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <strong>{video.title}</strong>（¥{video.price}）
            <br />
            <a href={video.video_url} target="_blank">動画を見る</a>
            <br />
            <img src={video.thumbnail_url} alt="サムネイル" width="200" />
            <button
  onClick={() => handlePurchase(video.id)}
  className="bg-green-600 text-white px-4 py-1 rounded mt-2"
>
  購入する
</button>

            <hr />
          </li>
        ))}
      </ul>
    </main>
  )
}
