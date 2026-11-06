import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationFile = path.resolve(here, '../db/migrations/0001_initial_schema.sql');
const connectionString = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL_DIRECT (preferred) or DATABASE_URL.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 10_000,
  application_name: 'klickkar-schema-migrator',
});

async function main() {
  const sql = await readFile(migrationFile, 'utf8');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(hashtext('klickkar_schema_migrations'))");
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version text PRIMARY KEY,
        checksum text NOT NULL,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const existing = await client.query(
      'SELECT checksum FROM schema_migrations WHERE version = $1',
      ['0001_initial_schema'],
    );

    const { createHash } = await import('node:crypto');
    const checksum = createHash('sha256').update(sql).digest('hex');

    if (existing.rowCount) {
      if (existing.rows[0].checksum !== checksum) {
        throw new Error('Migration checksum mismatch. Do not edit an applied migration; create a new migration instead.');
      }
      await client.query('COMMIT');
      console.log('Migration 0001_initial_schema is already applied.');
      return;
    }

    await client.query(sql);
    await client.query(
      'INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)',
      ['0001_initial_schema', checksum],
    );
    await client.query('COMMIT');
    console.log('Migration 0001_initial_schema applied successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

main()
  .catch((error) => {
    console.error('Database migration failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
