import { cookies as nextCookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mantém o nome que teu código espera:
export async function createSupabaseServer(): Promise<SupabaseClient> {
  const cookieStore = await nextCookies(); // <- no teu setup é Promise

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Em Server Components não dá pra mutar cookies aqui.
      // A leitura funciona; escrita deve ser feita em Route Handler / Middleware.
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(_cookies) {
          // no-op em RSC/Server Component (Next não permite mutar aqui)
        },
      },
    }
  );
}

// Alias para compatibilidade com imports antigos:
// import { getSupabaseServer } from '@/lib/supabase/server'
export const getSupabaseServer = createSupabaseServer;
