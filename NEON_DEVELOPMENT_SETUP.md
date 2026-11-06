# KlickKar Neon Development Database Setup

Status: development project and `development` branch created; schema applied and verified. The application is not yet connected.

## Safety boundary

- Neon project: `klickkar-dev` (Free tier, development/testing only).
- Branch: `development` (not the default `production` branch).
- No production data has been imported.
- Do not connect Render or the live website to this database.
- Do not change the Neon default branch.
- Do not paste connection strings, passwords, or tokens into chat or commit them.

## Local connection (when the owner is ready)

1. In Neon Console, open project `klickkar-dev` and select the `development` branch.
2. Open **Connect** and choose the `neondb` database and the owner role.
3. Copy the connection string only into the local ignored `.env` file in the project folder. Use the direct connection string for `DATABASE_URL_DIRECT`; use the pooled connection string for `DATABASE_URL` if Neon offers both.
4. Keep `.env` out of Git. The tracked `.env.example` contains blank placeholders only.
5. Run `npm install --legacy-peer-deps` and then `npm run db:migrate` from the project folder. The migration runner is idempotent and checks a SHA-256 checksum before applying the initial schema.
6. Verify tables in the Neon development branch. Do not run the migration against the default `production` branch.

## Current code preparation

- `pg` and `@types/pg` added as dependencies.
- `src/server/db.ts` exports an optional PostgreSQL pool and a connectivity check.
- `scripts/migrate.ts` applies the versioned SQL migration inside a transaction and uses a PostgreSQL advisory lock.
- `npm run db:migrate` is the migration command.
- The database pool is not yet wired into customer/admin APIs. That requires the next implementation phase and browser/API regression tests.

## Owner action required before app connection

The owner must place the development-only connection string in the local ignored `.env` file. If later a hosted staging service is chosen, configure its secret environment settings only after separate approval. Do not use Render production settings or the live service for this development connection.
