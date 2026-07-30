import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ADMIN_COOKIE_NAME, isValidAdminSessionToken } from '@/lib/adminAuth';

async function requireAdmin() {
  const cookieStore = await cookies();
  return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

function slugify(text: string): string {
  const stripped = text
    .toLowerCase()
    .normalize('NFD')
    .split('')
    .filter(ch => ch.charCodeAt(0) < 0x0300 || ch.charCodeAt(0) > 0x036f)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
  return stripped || randomUUID().slice(0, 8);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;
  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const fields = [
    'emoji', 'images', 'name_en', 'name_fr', 'name_ar',
    'desc_en', 'desc_fr', 'desc_ar', 'price', 'in_stock', 'badge', 'box_eligible',
  ] as const;
  const update: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in body) update[field] = body[field];
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from('products')
      .update(update)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    emoji, images, name_en, name_fr, name_ar,
    desc_en, desc_fr, desc_ar, price, in_stock, badge, box_eligible, sort_order,
  } = body;

  if (!name_fr || !name_en || !name_ar) {
    return NextResponse.json({ error: 'Le nom (FR/EN/AR) est requis' }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .insert([{
        id: randomUUID(),
        slug: slugify(name_en),
        emoji: emoji || '🍪',
        images: images ?? [],
        name_en, name_fr, name_ar,
        desc_en: desc_en ?? '', desc_fr: desc_fr ?? '', desc_ar: desc_ar ?? '',
        price: Number(price) || 0,
        in_stock: in_stock ?? true,
        badge: badge || null,
        box_eligible: box_eligible ?? true,
        sort_order: Number(sort_order) || 0,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
