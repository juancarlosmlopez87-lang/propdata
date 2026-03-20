import { NextResponse } from 'next/server';
import { clearUserCookie } from '@/lib/auth';

export async function POST() {
  try {
    clearUserCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
