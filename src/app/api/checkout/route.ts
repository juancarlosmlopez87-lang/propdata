import { NextRequest, NextResponse } from 'next/server';

const PLANS: Record<string, { name: string; price: number; interval: string; desc: string }> = {
  explorer: { name: 'SpainData Explorer', price: 7900, interval: 'month', desc: 'Consultas limitadas, 1 zona, datos basicos, alertas semanales' },
  analyst: { name: 'SpainData Analyst', price: 24900, interval: 'month', desc: 'Multi-zona, exportacion, alertas diarias, historial, soporte prioritario' },
  enterprise: { name: 'SpainData Enterprise', price: 79900, interval: 'month', desc: 'API completa, datos brutos, todas las zonas, soporte dedicado, white-label' },
};

function notifyTelegram(text: string) {
  return fetch('https://api.telegram.org/bot8451701836:AAHnoYbzI14jnyCVtfx05iuA_CfkYKwPtX8/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: '1802913178', text }),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = body.email || '';
  const plan = body.plan || '';
  const annual = body.annual === true;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email invalido' }, { status: 400 });
  }

  const planData = PLANS[plan?.toLowerCase()];
  if (!planData) {
    return NextResponse.json({ error: 'Plan no valido' }, { status: 400 });
  }

  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeKey || !stripeKey.startsWith('sk_')) {
    await notifyTelegram(`SPAINDATA CHECKOUT (sin Stripe)\nPlan: ${planData.name} (${planData.price / 100} EUR/mes)\nEmail: ${email}`);
    return NextResponse.json({ message: 'Te contactaremos para activar tu cuenta.' });
  }

  try {
    const origin = req.headers.get('origin') || 'https://propdata-ten.vercel.app';

    // Annual = 20% discount
    const monthlyPrice = planData.price;
    const unitAmount = annual ? Math.round(monthlyPrice * 0.80 * 12) : monthlyPrice;
    const interval = annual ? 'year' : 'month';

    const params = new URLSearchParams();
    params.set('payment_method_types[]', 'card');
    params.set('customer_email', email);
    params.set('line_items[0][price_data][currency]', 'eur');
    params.set('line_items[0][price_data][product_data][name]', planData.name);
    params.set('line_items[0][price_data][product_data][description]', planData.desc);
    params.set('line_items[0][price_data][unit_amount]', String(unitAmount));
    params.set('line_items[0][price_data][recurring][interval]', interval);
    params.set('line_items[0][quantity]', '1');
    params.set('mode', 'subscription');
    // Billing details for invoicing (B2B - always collect)
    params.set('billing_address_collection', 'required');
    params.set('tax_id_collection[enabled]', 'true');
    params.set('success_url', `${origin}/`);
    params.set('cancel_url', `${origin}/`);
    params.set('metadata[plan]', planData.name);
    params.set('metadata[email]', email);
    params.set('metadata[billing]', annual ? 'annual' : 'monthly');
    params.set('invoice_creation[enabled]', 'true');

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
      console.error('[STRIPE SPAINDATA]', JSON.stringify(result));
      await notifyTelegram(`SPAINDATA ERROR: ${result?.error?.message || 'unknown'}\nEmail: ${email}`);
      return NextResponse.json({ message: 'Te contactaremos para activar tu cuenta.' });
    }

    const priceStr = annual
      ? `${(unitAmount / 100).toFixed(0)} EUR/ano (${(Math.round(monthlyPrice * 0.80) / 100).toFixed(0)} EUR/mes)`
      : `${(monthlyPrice / 100).toFixed(0)} EUR/mes`;
    await notifyTelegram(`NUEVO CLIENTE SPAINDATA\nPlan: ${planData.name}\nPrecio: ${priceStr}\nEmail: ${email}`);

    return NextResponse.json({ url: result.url });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[STRIPE SPAINDATA]', errMsg);
    return NextResponse.json({ message: 'Te contactaremos para activar tu cuenta.' });
  }
}
