'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mantém o nome que teu código já usa:
export function createSupabaseBrowser(): SupabaseClient {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // funciona com a chave nova (publishable) ou anon
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// alias opcional, caso vc queira usar 'createClient' em algum lugar
export const createClient = createSupabaseBrowser;
