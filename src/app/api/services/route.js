import { executeD1Query } from '@/utils/d1Client';
import { isPostgresConfigured, executeQuery } from '@/utils/postgresClient';
import { NextResponse } from 'next/server';

async function initTable() {
  if (isPostgresConfigured()) {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(255),
        "desc" TEXT,
        image TEXT,
        video TEXT,
        features TEXT
      )
    `);
  } else {
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
}

export async function GET() {
  await initTable();
  const dbResult = await executeQuery("SELECT * FROM services");
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

    let dbResult;
    if (isPostgresConfigured()) {
      const sql = `
        INSERT INTO services (id, name, price, "desc", image, video, features)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          "desc" = EXCLUDED.desc,
          image = EXCLUDED.image,
          video = EXCLUDED.video,
          features = EXCLUDED.features
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
      dbResult = await executeQuery(sql, params);
    } else {
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
      dbResult = await executeD1Query(sql, params);
    }

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
    const dbResult = await executeQuery("DELETE FROM services WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
