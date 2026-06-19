import { executeD1Query } from '@/utils/d1Client';
import { NextResponse } from 'next/server';

export async function GET() {
  const dbResult = await executeD1Query("SELECT * FROM portfolio");
  if (!dbResult) {
    return NextResponse.json({ configured: false });
  }
  
  return NextResponse.json({ configured: true, portfolio: dbResult.results || [] });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, title, category, image, albumId } = body;
    
    // For portfolio, we can auto-generate or use the client provided ID
    let sql, params;
    if (id) {
      sql = `
        INSERT OR REPLACE INTO portfolio (id, title, category, image, albumId)
        VALUES (?, ?, ?, ?, ?)
      `;
      params = [id, title || '', category || 'Wedding', image || '', albumId || null];
    } else {
      sql = `
        INSERT INTO portfolio (title, category, image, albumId)
        VALUES (?, ?, ?, ?)
      `;
      params = [title || '', category || 'Wedding', image || '', albumId || null];
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
