// api/checkin.js — Vercel Serverless Function
// 接收打卡資料並寫入 Supabase

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, userName, picture, location, timestamp, type } = req.body;

  if (!userId || !userName) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase 環境變數未設定' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        user_name: userName,
        picture: picture || '',
        location: location || '',
        timestamp: timestamp || new Date().toISOString(),
        type: type || 'checkin'
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    return res.status(200).json({ success: true, message: '打卡成功' });

  } catch (err) {
    console.error('Supabase 寫入失敗:', err);
    return res.status(500).json({ error: '資料儲存失敗', detail: err.message });
  }
}
