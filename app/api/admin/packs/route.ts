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
    'emoji', 'name_en', 'name_fr', 'name_ar',
    'desc_en', 'desc_fr', 'desc_ar', 'size', 'price', 'original_price',
    'badge', 'badge_color', 'popular', 'active',
  ] as const;
  const update: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in body) update[field] = body[field];
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from('packs')
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
    emoji, name_en, name_fr, name_ar,
    desc_en, desc_fr, desc_ar, size, price, original_price,
    badge, badge_color, popular, active, sort_order,
  } = body;

  if (!name_fr || !name_en || !name_ar) {
    return NextResponse.json({ error: 'Le nom (FR/EN/AR) est requis' }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('packs')
      .insert([{
        id: slugify(name_en),
        emoji: emoji || '🎁',
        name_en, name_fr, name_ar,
        desc_en: desc_en ?? '', desc_fr: desc_fr ?? '', desc_ar: desc_ar ?? '',
        size: Number(size) || 1,
        price: Number(price) || 0,
        original_price: Number(original_price) || 0,
        badge: badge || null,
        badge_color: badge_color || null,
        popular: popular ?? false,
        active: active ?? true,
        sort_order: Number(sort_order) || 0,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pack: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from('packs')
      .delete()
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
