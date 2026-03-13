import { NextRequest, NextResponse } from 'next/server';

const PLANS: Record<string, { name: string; price: number; interval: string }> = {
  explorer: { name: 'Explorer', price: 7900, interval: 'month' },
  analyst: { name: 'Analyst', price: 24900, interval: 'month' },
  enterprise: { name: 'Enterprise', price: 79900, interval: 'month' },
};

export async function POST(req: NextRequest) {
  const { plan, email } = await req.json();

  if (!email || !email.includes('@') || !email.includes('.')) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }

  const planData = PLANS[plan?.toLowerCase()];
  if (!planData) {
    return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    // Notify via Telegram and return manual message
    try {
      await fetch('https://api.telegram.org/bot8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '1802913178',
          text: `💰 PROPDATA PAGO INTENTO\nPlan: ${planData.name} (${planData.price / 100}€/mes)\nEmail: ${email}\n⚠️ Stripe no configurado`,
        }),
      });
    } catch {}
    return NextResponse.json({ message: 'Te contactaremos para activar tu cuenta.' });
  }

  try {
    const origin = req.headers.get('origin') || 'https://propdata-ten.vercel.app';

    const params = new URLSearchParams();
    params.append('payment_method_types[]', 'card');
    params.append('customer_email', email);
    params.append('line_items[0][price_data][currency]', 'eur');
    params.append('line_items[0][price_data][product_data][name]', `PropData.es — Plan ${planData.name}`);
    params.append('line_items[0][price_data][product_data][description]', `Suscripción mensual PropData ${planData.name}`);
    params.append('line_items[0][price_data][unit_amount]', String(planData.price));
    params.append('line_items[0][price_data][recurring][interval]', planData.interval);
    params.append('line_items[0][quantity]', '1');
    params.append('mode', 'subscription');
    params.append('success_url', `${origin}/?payment=success&plan=${plan}`);
    params.append('cancel_url', `${origin}/?payment=cancelled`);
    params.append('metadata[plan]', planData.name);
    params.append('metadata[email]', email);

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[STRIPE ERROR]', JSON.stringify(result));
      return NextResponse.json({ message: 'Te contactaremos para activar tu cuenta.' });
    }

    // Send Telegram notification
    try {
      await fetch('https://api.telegram.org/bot8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '1802913178',
          text: `💰 PROPDATA CHECKOUT\nPlan: ${planData.name} (${planData.price / 100}€/mes)\nEmail: ${email}\n🔗 Stripe session creada`,
        }),
      });
    } catch {}

    return NextResponse.json({ url: result.url });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[STRIPE ERROR]', errMsg);
    return NextResponse.json({ message: 'Te contactaremos para activar tu cuenta.' });
  }
}
