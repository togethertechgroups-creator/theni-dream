import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Determine the absolute URL
    let absoluteUrl = fileUrl;
    if (fileUrl.startsWith('/')) {
      const origin = req.nextUrl.origin;
      absoluteUrl = `${origin}${fileUrl}`;
    }

    const res = await fetch(absoluteUrl);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
