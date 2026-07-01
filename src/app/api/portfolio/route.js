import { executeD1Query } from '@/utils/d1Client';
import { isPostgresConfigured, executeQuery } from '@/utils/postgresClient';
import { NextResponse } from 'next/server';

async function initTable() {
  if (isPostgresConfigured()) {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        image TEXT,
        video TEXT,
        "albumId" VARCHAR(255)
      )
    `);
    try {
      await executeQuery('ALTER TABLE portfolio ADD COLUMN video TEXT');
    } catch (e) {}
    try {
      await executeQuery('ALTER TABLE portfolio ADD COLUMN "albumId" VARCHAR(255)');
    } catch (e) {}
  } else {
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
      await executeD1Query("ALTER TABLE portfolio ADD COLUMN video TEXT");
    } catch (e) {}
    try {
      await executeD1Query("ALTER TABLE portfolio ADD COLUMN albumId TEXT");
    } catch (e) {}
  }
}

export async function GET() {
  await initTable();
  const dbResult = await executeQuery("SELECT * FROM portfolio");
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
    
    let dbResult;
    if (isPostgresConfigured()) {
      if (id) {
        const sql = `
          INSERT INTO portfolio (id, title, category, image, video, "albumId")
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            image = EXCLUDED.image,
            video = EXCLUDED.video,
            "albumId" = EXCLUDED."albumId"
        `;
        const params = [id, title || '', category || 'Wedding', image || '', video || '', albumId || null];
        dbResult = await executeQuery(sql, params);
      } else {
        const sql = `
          INSERT INTO portfolio (title, category, image, video, "albumId")
          VALUES ($1, $2, $3, $4, $5)
        `;
        const params = [title || '', category || 'Wedding', image || '', video || '', albumId || null];
        dbResult = await executeQuery(sql, params);
      }
    } else {
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

    const dbResult = await executeQuery("DELETE FROM portfolio WHERE id = ?", [id]);
    if (!dbResult) {
      return NextResponse.json({ success: false, error: 'Database query failed or not configured' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

