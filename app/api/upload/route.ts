import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// SupabaseのURLとAPIキーをここに設定！
const supabaseUrl = 'https://vnotsygoulgtnoxkioan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZub3RzeWdvdWxndG5veGtpb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTY5MzMsImV4cCI6MjA2MTEzMjkzM30.BpBSgug1ATI19KLL9f2U-o9Zfy7xusKbjuyeihio9RA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Bunny.net設定
const bunnyStorageZoneName = 'fetickle-video';
const bunnyApiKey = '7fd8a389-4404-401a-bb3f76dc8957-be1f-4535';
const bunnyStorageHost = `https://storage.bunnycdn.com/${bunnyStorageZoneName}/`;
const bunnyPullZoneUrl = 'https://cdn.fetickle.com/';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;

  if (!file) {
    return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });
  }

  const fileName = encodeURIComponent(file.name);

  try {
    // Bunny.netにファイルアップロード
    const uploadRes = await axios.put(
      bunnyStorageHost + fileName,
      file.stream(),
      {
        headers: {
          AccessKey: bunnyApiKey,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    if (uploadRes.status !== 201 && uploadRes.status !== 200) {
      return NextResponse.json({ error: 'Bunnyアップロード失敗' }, { status: 500 });
    }

    // 保存する動画URLを作成
    const videoUrl = `${bunnyPullZoneUrl}${fileName}`;

    // Supabaseにメタ情報登録
    const { data, error } = await supabase.from('videos').insert([
      {
        title,
        description,
        price: parseInt(price),
        url: videoUrl,
      },
    ]);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'DB保存失敗' }, { status: 500 });
    }

    return NextResponse.json({ success: true, videoUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'エラー発生' }, { status: 500 });
  }
}
