import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export const createSupabaseServer = async (): Promise<SupabaseClient> => {
  // no teu setup, cookies() é Promise → usa await
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Em Server Components, Next não permite mutar cookies:
        set() {},
        remove() {}
      }
    }
  );
};
