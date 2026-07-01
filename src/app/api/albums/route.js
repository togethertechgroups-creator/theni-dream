import { executeD1Query } from '@/utils/d1Client';
import { NextResponse } from 'next/server';

export async function GET() {
  const dbResult = await executeD1Query("SELECT * FROM albums");
  if (!dbResult) {
    return NextResponse.json({ configured: false });
  }
  
  // Parse JSON fields (photos, videos) back to objects
  const albumsList = (dbResult.results || []).map(row => ({
    ...row,
    photos: row.photos ? JSON.parse(row.photos) : [],
    videos: row.videos ? JSON.parse(row.videos) : []
  }));
  
  return NextResponse.json({ configured: true, albums: albumsList });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, eventCode, clientName, mobile, eventName, eventDate, location, category, albumType, photos, videos } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing album id' }, { status: 400 });
    }

    const sql = `
      INSERT OR REPLACE INTO albums (id, eventCode, clientName, mobile, eventName, eventDate, location, category, albumType, photos, videos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      eventCode || '',
      clientName || '',
      mobile || '',
      eventName || '',
      eventDate || '',
      location || '',
      category || 'Wedding',
      albumType || 'general',
      JSON.stringify(photos || []),
      JSON.stringify(videos || [])
    ];

    const dbResult = await executeD1Query(sql, params);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    const dbResult = await executeD1Query("DELETE FROM albums WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
