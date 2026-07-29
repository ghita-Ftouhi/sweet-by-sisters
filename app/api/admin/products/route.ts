import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { ADMIN_COOKIE_NAME, isValidAdminSessionToken } from '@/lib/adminAuth';

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, price, in_stock, badge } = await req.json();
  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('products')
    .update({ price, in_stock, badge })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
