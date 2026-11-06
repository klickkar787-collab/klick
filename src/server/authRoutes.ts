import { randomBytes } from 'node:crypto';
import { Router, Request, Response, NextFunction } from 'express';
import type { Pool } from 'pg';
import { createSessionToken, hashPassword, hashSessionToken, verifyPassword } from './authCrypto.ts';

const SESSION_COOKIE = process.env.NODE_ENV === 'production'
  ? '__Host-klickkar_session'
  : 'klickkar_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  company_name: string | null;
  role: 'admin' | 'provider' | 'customer';
  status: string;
  password_hash: string;
  created_at: Date | string;
  last_login_at: Date | string | null;
};

type PublicUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  companyName?: string;
  role: UserRow['role'];
  status: 'Active' | 'Suspended' | 'Pending';
  createdAt: string;
  lastLogin?: string;
};

type LoginAttempt = { count: number; resetAt: number };
const loginAttempts = new Map<string, LoginAttempt>();
const dummyPasswordHash = hashPassword(randomBytes(32).toString('hex'));

function toPublicUser(row: UserRow): PublicUser {
  const status: PublicUser['status'] =
    row.status === 'active' ? 'Active' : row.status === 'suspended' ? 'Suspended' : 'Pending';
  return {
    id: row.id,
    email: row.email,
    name: row.full_name,
    phone: row.phone || '',
    ...(row.company_name ? { companyName: row.company_name } : {}),
    role: row.role,
    status,
    createdAt: new Date(row.created_at).toISOString().slice(0, 10),
    ...(row.last_login_at ? { lastLogin: new Date(row.last_login_at).toISOString() } : {}),
  };
}

function getCookie(req: Request, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return null;
    }
  }
  return null;
}

function setSessionCookie(res: Response, token: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure}`,
  );
}

function clearSessionCookie(res: Response): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
  );
}

function isSameOrigin(req: Request): boolean {
  const origin = req.get('origin');
  const host = req.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

function getRateLimitKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function isRateLimited(req: Request): boolean {
  const now = Date.now();
  const key = getRateLimitKey(req);
  const current = loginAttempts.get(key);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > LOGIN_MAX_ATTEMPTS;
}

function clearRateLimit(req: Request): void {
  loginAttempts.delete(getRateLimitKey(req));
}

function requireDatabase(res: Response, pool: Pool | null): pool is Pool {
  if (!pool) {
    res.status(503).json({ error: 'Authentication service is temporarily unavailable.' });
    return false;
  }
  return true;
}

export function createAuthRouter(pool: Pool | null): Router {
  const router = Router();

  router.post('/login', async (req: Request, res: Response) => {
    if (!isSameOrigin(req)) {
      return res.status(403).json({ error: 'Request origin could not be verified.' });
    }
    if (isRateLimited(req)) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }
    if (!requireDatabase(res, pool)) return;

    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'A JSON object is required.' });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }
    if (password.length < 12 || password.length > 256) {
      return res.status(400).json({ error: 'Password must be between 12 and 256 characters.' });
    }

    try {
      const result = await pool.query<UserRow>(
        `SELECT id, email, full_name, phone, company_name, role, status,
                password_hash, created_at, last_login_at
         FROM user_accounts
         WHERE email_normalized = $1
         LIMIT 1`,
        [email],
      );
      const user = result.rows[0];
      const storedHash = user?.password_hash || await dummyPasswordHash;
      const passwordValid = await verifyPassword(password, storedHash);

      if (!user || !passwordValid) {
        return res.status(401).json({ error: 'Invalid email address or password.' });
      }
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'This account is not active. Please contact the administrator.' });
      }

      const token = createSessionToken();
      const tokenHash = hashSessionToken(token);
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      const ipAddress = req.ip || req.socket.remoteAddress || null;
      const userAgent = (req.get('user-agent') || '').slice(0, 500) || null;

      await pool.query(
        `INSERT INTO user_sessions (user_id, token_hash, expires_at, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, tokenHash, expiresAt, ipAddress, userAgent],
      );
      await pool.query(
        'UPDATE user_accounts SET last_login_at = now(), updated_at = now() WHERE id = $1',
        [user.id],
      );

      clearRateLimit(req);
      setSessionCookie(res, token);
      return res.json({
        user: toPublicUser({ ...user, last_login_at: new Date() }),
      });
    } catch (error) {
      console.error('Authentication login failed:', error instanceof Error ? error.message : 'Unknown error');
      return res.status(503).json({ error: 'Authentication service is temporarily unavailable.' });
    }
  });

  router.get('/me', async (req: Request, res: Response) => {
    if (!requireDatabase(res, pool)) return;
    const token = getCookie(req, SESSION_COOKIE);
    if (!token) return res.status(401).json({ error: 'Not authenticated.' });

    try {
      const result = await pool.query<UserRow>(
        `SELECT u.id, u.email, u.full_name, u.phone, u.company_name, u.role, u.status,
                u.password_hash, u.created_at, u.last_login_at
         FROM user_sessions s
         JOIN user_accounts u ON u.id = s.user_id
         WHERE s.token_hash = $1
           AND s.revoked_at IS NULL
           AND s.expires_at > now()
         LIMIT 1`,
        [hashSessionToken(token)],
      );
      const user = result.rows[0];
      if (!user || user.status !== 'active') {
        clearSessionCookie(res);
        return res.status(401).json({ error: 'Not authenticated.' });
      }
      return res.json({ user: toPublicUser(user) });
    } catch (error) {
      console.error('Authentication session lookup failed:', error instanceof Error ? error.message : 'Unknown error');
      return res.status(503).json({ error: 'Authentication service is temporarily unavailable.' });
    }
  });

  router.post('/logout', async (req: Request, res: Response) => {
    if (!isSameOrigin(req)) {
      return res.status(403).json({ error: 'Request origin could not be verified.' });
    }
    if (!requireDatabase(res, pool)) return;
    const token = getCookie(req, SESSION_COOKIE);
    if (token) {
      try {
        await pool.query(
          'UPDATE user_sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL',
          [hashSessionToken(token)],
        );
      } catch (error) {
        console.error('Authentication logout failed:', error instanceof Error ? error.message : 'Unknown error');
        return res.status(503).json({ error: 'Could not end the session. Please try again.' });
      }
    }
    clearSessionCookie(res);
    return res.status(204).end();
  });

  return router;
}

export function requireAuthenticated(pool: Pool, allowedRoles?: UserRow['role']) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = getCookie(req, SESSION_COOKIE);
    if (!token) return res.status(401).json({ error: 'Authentication required.' });

    try {
      const result = await pool.query<UserRow>(
        `SELECT u.id, u.email, u.full_name, u.phone, u.company_name, u.role, u.status,
                u.password_hash, u.created_at, u.last_login_at
         FROM user_sessions s
         JOIN user_accounts u ON u.id = s.user_id
         WHERE s.token_hash = $1
           AND s.revoked_at IS NULL
           AND s.expires_at > now()
         LIMIT 1`,
        [hashSessionToken(token)],
      );
      const user = result.rows[0];
      if (!user || user.status !== 'active') return res.status(401).json({ error: 'Authentication required.' });
      if (allowedRoles && user.role !== allowedRoles) return res.status(403).json({ error: 'Insufficient permissions.' });
      res.locals.authUser = toPublicUser(user);
      return next();
    } catch (error) {
      console.error('Authentication middleware failed:', error instanceof Error ? error.message : 'Unknown error');
      return res.status(503).json({ error: 'Authentication service is temporarily unavailable.' });
    }
  };
}
