import { executeD1Query } from '@/utils/d1Client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function initTable() {
  await executeD1Query(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      type TEXT,
      desc TEXT,
      popular INTEGER DEFAULT 0,
      features TEXT
    )
  `);
}

export async function GET() {
  await initTable();
  const dbResult = await executeD1Query("SELECT * FROM packages");
  if (!dbResult) {
    return NextResponse.json({ configured: false });
  }
  const packagesList = (dbResult.results || []).map(row => ({
    ...row,
    popular: !!row.popular,
    features: row.features ? JSON.parse(row.features) : []
  }));
  return NextResponse.json({ configured: true, packages: packagesList });
}

export async function POST(req) {
  try {
    await initTable();
    const body = await req.json();
    const { id, name, price, type, desc, popular, features } = body;
    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'Missing package id or name' }, { status: 400 });
    }
    const sql = `
      INSERT OR REPLACE INTO packages (id, name, price, type, desc, popular, features)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      name,
      price || '',
      type || '',
      desc || '',
      popular ? 1 : 0,
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
    const dbResult = await executeD1Query("DELETE FROM packages WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
