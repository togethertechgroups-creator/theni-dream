import { executeD1Query } from '@/utils/d1Client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function initTable() {
  await executeD1Query(`
    CREATE TABLE IF NOT EXISTS team (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT,
      image TEXT
    )
  `);
}

export async function GET() {
  await initTable();
  const dbResult = await executeD1Query("SELECT * FROM team");
  if (!dbResult) {
    return NextResponse.json({ configured: false });
  }
  return NextResponse.json({ configured: true, team: dbResult.results || [] });
}

export async function POST(req) {
  try {
    await initTable();
    const body = await req.json();
    const { id, name, role, bio, image } = body;
    if (!id || !name || !role) {
      return NextResponse.json({ success: false, error: 'Missing team member id, name, or role' }, { status: 400 });
    }
    const sql = `
      INSERT OR REPLACE INTO team (id, name, role, bio, image)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      name,
      role,
      bio || '',
      image || '/pic/pic-5.png'
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
    await initTable();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }
    const dbResult = await executeD1Query("DELETE FROM team WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
