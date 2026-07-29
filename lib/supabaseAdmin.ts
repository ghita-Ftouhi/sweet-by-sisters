import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Bypasses Row Level Security — never import this from client components.
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
