import { createHmac } from 'crypto';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db-server';

const AUTH_SECRET = process.env.AUTH_SECRET || 'propdata-secret-2026';
const COOKIE_NAME = 'propdata_user';
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function toBase64Url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Buffer {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

export function generateToken(userId: string): string {
  const payload = JSON.stringify({ uid: userId, iat: Date.now() });
  const payloadB64 = toBase64Url(Buffer.from(payload, 'utf-8'));
  const sig = createHmac('sha256', AUTH_SECRET).update(payloadB64).digest();
  const sigB64 = toBase64Url(sig);
  return `${payloadB64}.${sigB64}`;
}

export function extractUserId(token: string): string | null {
  try {
    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) return null;

    const expectedSig = createHmac('sha256', AUTH_SECRET).update(payloadB64).digest();
    const providedSig = fromBase64Url(sigB64);
    if (!expectedSig.equals(providedSig)) return null;

    const payload = JSON.parse(fromBase64Url(payloadB64).toString('utf-8'));

    if (!payload.iat || Date.now() - payload.iat > MAX_AGE * 1000) return null;

    return payload.uid || null;
  } catch {
    return null;
  }
}

export async function getUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const userId = extractUserId(token);
    if (!userId) return null;

    const rows = await sql`SELECT id, email, name, plan FROM users WHERE id = ${userId} AND app = 'propdata' LIMIT 1`;
    if (!rows.length) return null;

    return rows[0];
  } catch {
    return null;
  }
}

export function setUserCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearUserCookie() {
  cookies().set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
