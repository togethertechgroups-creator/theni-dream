import { executeD1Query } from '@/utils/d1Client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function initTable() {
  await executeD1Query(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      video TEXT,
      albumId TEXT
    )
  `);
  try {
    // Add video column if it doesn't exist in existing table
    await executeD1Query("ALTER TABLE portfolio ADD COLUMN video TEXT");
  } catch (e) {
    // Column might already exist
  }
}

export async function GET() {
  await initTable();
  const dbResult = await executeD1Query("SELECT * FROM portfolio");
  if (!dbResult) {
    return NextResponse.json({ configured: false });
  }
  
  return NextResponse.json({ configured: true, portfolio: dbResult.results || [] });
}

export async function POST(req) {
  try {
    await initTable();
    const body = await req.json();
    const { id, title, category, image, video, albumId } = body;
    
    let sql, params;
    if (id) {
      sql = `
        INSERT OR REPLACE INTO portfolio (id, title, category, image, video, albumId)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      params = [id, title || '', category || 'Wedding', image || '', video || '', albumId || null];
    } else {
      sql = `
        INSERT INTO portfolio (title, category, image, video, albumId)
        VALUES (?, ?, ?, ?, ?)
      `;
      params = [title || '', category || 'Wedding', image || '', video || '', albumId || null];
    }

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
    await initTable();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    const dbResult = await executeD1Query("DELETE FROM portfolio WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

