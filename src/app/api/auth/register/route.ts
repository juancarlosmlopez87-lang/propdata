import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, name, phone } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Email no valido' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'La contrasena debe tener al menos 6 caracteres' }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (email, password_hash, name, phone, app, plan)
      VALUES (${email.toLowerCase().trim()}, ${password_hash}, ${name.trim()}, ${phone || null}, 'propdata', 'trial')
    `;

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('already exists')) {
      return NextResponse.json({ error: 'Ya existe una cuenta con este email' }, { status: 409 });
    }
    console.error('[REGISTER]', msg);
    return NextResponse.json({ error: 'Error al crear la cuenta' }, { status: 500 });
  }
}
