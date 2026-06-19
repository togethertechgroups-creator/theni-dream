export async function executeD1Query(sql, params = []) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return null; // D1 is not configured
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
      return data.result[0]; // returns { results: [...], success: true, meta: ... }
    }
    return null;
  } catch (error) {
    console.error('Error executing D1 query:', error);
    return null;
  }
}
