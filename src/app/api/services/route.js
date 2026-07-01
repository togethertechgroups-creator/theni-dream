import { executeD1Query } from '@/utils/d1Client';
import { NextResponse } from 'next/server';

async function initTable() {
  await executeD1Query(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price TEXT,
      desc TEXT,
      image TEXT,
      video TEXT,
      features TEXT
    )
  `);
}

export async function GET() {
  await initTable();
  const dbResult = await executeD1Query("SELECT * FROM services");
  if (!dbResult) {
    return NextResponse.json({ configured: false });
  }
  const servicesList = (dbResult.results || []).map(row => ({
    ...row,
    features: row.features ? JSON.parse(row.features) : []
  }));
  return NextResponse.json({ configured: true, services: servicesList });
}

export async function POST(req) {
  try {
    await initTable();
    const body = await req.json();
    const { id, name, price, desc, image, video, features } = body;
    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'Missing service id or name' }, { status: 400 });
    }
    const sql = `
      INSERT OR REPLACE INTO services (id, name, price, desc, image, video, features)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      name,
      price || '',
      desc || '',
      image || '',
      video || '',
      JSON.stringify(features || [])
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
    const dbResult = await executeD1Query("DELETE FROM services WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
