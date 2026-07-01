import { executeD1Query } from '@/utils/d1Client';
import { NextResponse } from 'next/server';

async function initTable() {
  await executeD1Query(`
    CREATE TABLE IF NOT EXISTS service_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      desc TEXT,
      price TEXT,
      image TEXT,
      services TEXT
    )
  `);
}

export async function GET() {
  await initTable();
  const dbResult = await executeD1Query("SELECT * FROM service_categories");
  if (!dbResult) {
    return NextResponse.json({ configured: false });
  }
  const categoriesList = (dbResult.results || []).map(row => ({
    ...row,
    services: row.services ? JSON.parse(row.services) : []
  }));
  return NextResponse.json({ configured: true, categories: categoriesList });
}

export async function POST(req) {
  try {
    await initTable();
    const body = await req.json();
    const { id, name, desc, price, image, services } = body;
    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'Missing category id or name' }, { status: 400 });
    }
    const sql = `
      INSERT OR REPLACE INTO service_categories (id, name, desc, price, image, services)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      name,
      desc || '',
      price || '',
      image || '',
      JSON.stringify(services || [])
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
    const dbResult = await executeD1Query("DELETE FROM service_categories WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
