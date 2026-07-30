import { supabase } from './supabase';
import type { Product } from './products';
import type { Pack } from './packs';

function rowToProduct(r: Record<string, unknown>): Product {
  return {
    id: r.id as string,
    slug: r.slug as string,
    emoji: r.emoji as string,
    images: (r.images as string[] | null) ?? undefined,
    nameEn: r.name_en as string,
    nameFr: r.name_fr as string,
    nameAr: r.name_ar as string,
    descEn: r.desc_en as string,
    descFr: r.desc_fr as string,
    descAr: r.desc_ar as string,
    price: Number(r.price),
    inStock: r.in_stock as boolean,
    badge: r.badge as Product['badge'],
    boxEligible: r.box_eligible !== false,
  };
}

function rowToPack(r: Record<string, unknown>): Pack {
  return {
    id: r.id as string,
    emoji: r.emoji as string,
    nameEn: r.name_en as string,
    nameFr: r.name_fr as string,
    nameAr: r.name_ar as string,
    descEn: r.desc_en as string,
    descFr: r.desc_fr as string,
    descAr: r.desc_ar as string,
    size: r.size as number,
    price: Number(r.price),
    originalPrice: Number(r.original_price),
    badge: r.badge as string | undefined,
    badgeColor: r.badge_color as string | undefined,
    popular: r.popular as boolean | undefined,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order');
  if (error || !data) return [];
  return data.map(rowToProduct);
}

export async function fetchPacks(): Promise<Pack[]> {
  const { data, error } = await supabase
    .from('packs')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  if (error || !data) return [];
  return data.map(rowToPack);
}

export interface OrderPayload {
  total: number;
  payment_method: 'card' | 'whatsapp';
  locale: string;
  items: {
    name: string;
    emoji: string;
    price: number;
    quantity: number;
    type: 'cookie' | 'box';
    contents?: { name: string; emoji: string; quantity: number }[];
  }[];
}

export async function saveOrder(order: OrderPayload) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...order, status: 'pending' }])
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}
