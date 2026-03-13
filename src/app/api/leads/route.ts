import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const msg = `🏗️ PROPDATA LEAD\nPlan: ${plan}\nEmail: ${email}\nFecha: ${new Date().toISOString()}`;

    await fetch('https://api.telegram.org/bot8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: '1802913178', text: msg }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
