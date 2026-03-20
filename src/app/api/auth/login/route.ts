import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db-server';
import { generateToken, setUserCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contrasena son obligatorios' }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, email, password_hash, name, plan
      FROM users
      WHERE email = ${email.toLowerCase().trim()} AND app = 'propdata'
      LIMIT 1
    `;

    if (!rows.length) {
      return NextResponse.json({ error: 'Email o contrasena incorrectos' }, { status: 401 });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Email o contrasena incorrectos' }, { status: 401 });
    }

    const token = generateToken(String(user.id));
    setUserCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[LOGIN]', msg);
    return NextResponse.json({ error: 'Error al iniciar sesion' }, { status: 500 });
  }
}
