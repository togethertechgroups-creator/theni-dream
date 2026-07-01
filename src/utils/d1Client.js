// Simple in-memory cache for D1 SELECT queries to eliminate database query overhead on page loads
const queryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function clearD1Cache() {
  queryCache.clear();
}

export async function executeD1Query(sql, params = []) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return null; // D1 is not configured
  }

  const isSelect = sql.trim().toUpperCase().startsWith('SELECT');

  if (isSelect) {
    const cacheKey = JSON.stringify({ sql, params });
    const cached = queryCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }
  } else {
    // Invalidate the cache completely on write operations (INSERT, UPDATE, DELETE, etc.)
    queryCache.clear();
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('D1 query failed:', errorText);
      return null;
    }

    const data = await res.json();
    if (data.success && data.result && data.result[0]) {
      const dbResult = data.result[0];
      if (isSelect) {
        const cacheKey = JSON.stringify({ sql, params });
        queryCache.set(cacheKey, { data: dbResult, timestamp: Date.now() });
      }
      return dbResult; // returns { results: [...], success: true, meta: ... }
    }
    return null;
  } catch (error) {
    console.error('Error executing D1 query:', error);
    return null;
  }
}
