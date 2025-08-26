'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        // 1) Fluxo PKCE (Supabase retorna ?code=...)
        const code = params.get('code');
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else {
          // 2) Fluxo implicit (Supabase volta com #access_token=...)
          const hash = typeof window !== 'undefined' ? window.location.hash : '';
          if (hash && hash.includes('access_token')) {
            const qs = new URLSearchParams(hash.slice(1));
            const access_token = qs.get('access_token') || '';
            const refresh_token = qs.get('refresh_token') || '';
            if (access_token) {
              await supabase.auth.setSession({ access_token, refresh_token });
            }
          }
        }
      } catch (e) {
        // se algo falhar, segue pro destino do mesmo jeito
        console.error('OAuth Callback error:', e);
      } finally {
        const redirect = params.get('redirect') || '/dashboard';
        router.replace(redirect);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
      Conectando com sua conta…
    </div>
  );
}

// Evita pré-render estatico
export const dynamic = 'force-dynamic';
