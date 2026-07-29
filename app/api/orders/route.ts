import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveOrder, fetchOrders, updateOrderStatus, type OrderPayload } from '@/lib/db';
import { ADMIN_COOKIE_NAME, isValidAdminSessionToken } from '@/lib/adminAuth';

async function isAdminRequest() {
  const cookieStore = await cookies();
  return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

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
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const orders = await fetchOrders();
    return NextResponse.json(orders);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, status } = await req.json();
    await updateOrderStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
