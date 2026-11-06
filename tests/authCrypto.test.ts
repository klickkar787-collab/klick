import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionToken, hashPassword, hashSessionToken, verifyPassword } from '../src/server/authCrypto.ts';

test('password hashes verify without storing plaintext', async () => {
  const password = 'KlickKar-Test-Password-2026!';
  const hash = await hashPassword(password);
  assert.notEqual(hash, password);
  assert.equal(hash.startsWith('scrypt$16384$8$1$'), true);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('incorrect-password', hash), false);
});

test('password hashing enforces a bounded minimum length', async () => {
  await assert.rejects(() => hashPassword('short'));
});

test('session tokens are high entropy and stored as one-way hashes', () => {
  const first = createSessionToken();
  const second = createSessionToken();
  assert.notEqual(first, second);
  assert.equal(first.length >= 40, true);
  assert.notEqual(hashSessionToken(first), first);
  assert.equal(hashSessionToken(first), hashSessionToken(first));
});
