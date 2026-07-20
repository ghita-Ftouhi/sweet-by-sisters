import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { items, locale } = await req.json();

    const line_items = items.map((item: { name: string; price: number; quantity: number; emoji: string }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.emoji} ${item.name}`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/cart`,
      locale: locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr' : 'en',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
