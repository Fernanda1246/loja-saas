'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    (async () => {
      const redirect = params.get('redirect') || '/dashboard';

      try {
        // 1) Fluxo PKCE (Google -> Supabase -> sua app com ?code=...)
        const code = params.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          router.replace(redirect);
          router.refresh();
          return;
        }

        // 2) Fluxo "implicit" (Google -> Supabase -> sua app com #access_token=...)
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
          if (error) throw error;
          router.replace(redirect);
          router.refresh();
          return;
        }

        // 3) Nada reconhecido: volta para o login
        router.replace('/login?e=callback-not-recognized');
      } catch (e: any) {
        router.replace('/login?e=' + encodeURIComponent(e?.message || 'oauth-error'));
      }
    })();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-[#0F172A]">
      Finalizando login…
    </div>
  );
}
