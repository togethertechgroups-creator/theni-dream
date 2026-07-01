import { executeD1Query } from '@/utils/d1Client';
import { isPostgresConfigured, executeQuery } from '@/utils/postgresClient';
import { NextResponse } from 'next/server';

async function initTable() {
  if (isPostgresConfigured()) {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS service_categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        "desc" TEXT,
        price VARCHAR(255),
        image TEXT,
        services TEXT
      )
    `);
  } else {
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
}

export async function GET() {
  await initTable();
  const dbResult = await executeQuery("SELECT * FROM service_categories");
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

    let dbResult;
    if (isPostgresConfigured()) {
      const sql = `
        INSERT INTO service_categories (id, name, "desc", price, image, services)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          "desc" = EXCLUDED.desc,
          price = EXCLUDED.price,
          image = EXCLUDED.image,
          services = EXCLUDED.services
      `;
      const params = [
        id,
        name,
        desc || '',
        price || '',
        image || '',
        JSON.stringify(services || [])
      ];
      dbResult = await executeQuery(sql, params);
    } else {
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
    const dbResult = await executeQuery("DELETE FROM service_categories WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
