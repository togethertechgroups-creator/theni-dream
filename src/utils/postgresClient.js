import { sql } from '@vercel/postgres';
import { executeD1Query } from './d1Client';

// Helper to determine if Vercel Postgres is configured
export function isPostgresConfigured() {
  return !!process.env.POSTGRES_URL;
}

// Executes query on Vercel Postgres or falls back to Cloudflare D1
export async function executeQuery(queryStr, params = [], fallbackD1Sql = null) {
  if (isPostgresConfigured()) {
    try {
      // Vercel Postgres query execution
      // Replace SQLite placeholders (?) with Postgres positional parameters ($1, $2, etc.)
      let pgQuery = queryStr;
      if (params.length > 0) {
        let index = 1;
        pgQuery = queryStr.replace(/\?/g, () => `$${index++}`);
      }
      
      const { rows } = await sql.query(pgQuery, params);
      return { results: rows, success: true };
    } catch (err) {
      console.error('Vercel Postgres query failed, falling back to D1:', err);
      // Fallback to D1 query on Postgres error if fallback SQL is provided
      if (fallbackD1Sql) {
        return executeD1Query(fallbackD1Sql, params);
      }
      return executeD1Query(queryStr, params);
    }
  }

  // If Postgres is not configured, run directly on D1
  return executeD1Query(fallbackD1Sql || queryStr, params);
}
