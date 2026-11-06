import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { createAuthRouter } from '../src/server/authRoutes.ts';

async function withAuthServer(run: (baseUrl: string) => Promise<void>) {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', createAuthRouter(null));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not start auth test server');
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('auth login rejects missing or mismatched Origin before database access', async () => {
  await withAuthServer(async (baseUrl) => {
    const missingOrigin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'a-very-long-test-password' }),
    });
    assert.equal(missingOrigin.status, 403);

    const mismatchedOrigin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://attacker.example',
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'a-very-long-test-password' }),
    });
    assert.equal(mismatchedOrigin.status, 403);
  });
});

test('auth endpoints fail closed when the database is not configured', async () => {
  await withAuthServer(async (baseUrl) => {
    const headers = {
      'Content-Type': 'application/json',
      Origin: baseUrl,
    };
    const login = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: 'test@example.com', password: 'a-very-long-test-password' }),
    });
    assert.equal(login.status, 503);

    const session = await fetch(`${baseUrl}/api/auth/me`);
    assert.equal(session.status, 503);

    const logout = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Origin: baseUrl },
    });
    assert.equal(logout.status, 503);
  });
});
