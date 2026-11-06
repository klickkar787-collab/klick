import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

export const databaseConfigured = Boolean(connectionString);

export const pool = connectionString
  ? new Pool({
      connectionString,
      max: Number.parseInt(process.env.DB_POOL_MAX || '5', 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      application_name: 'klickkar-web',
    })
  : null;

export async function checkDatabaseConnection(): Promise<boolean> {
  if (!pool) return false;
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    return true;
  } finally {
    client.release();
  }
}
