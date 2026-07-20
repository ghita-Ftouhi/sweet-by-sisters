import { NextRequest, NextResponse } from 'next/server';
import { saveOrder, fetchOrders, updateOrderStatus, type OrderPayload } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();
    const id = await saveOrder(body);
    return NextResponse.json({ id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await fetchOrders();
    return NextResponse.json(orders);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    await updateOrderStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
