import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// Bypasses Row Level Security — never import this from client components.
// Created lazily (not at module load) so a missing env var only breaks the
// specific admin request that needs it, instead of crashing the whole build.
export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY is not set');
    }
    client = createClient(url, serviceKey, { auth: { persistSession: false } });
  }
  return client;
}
