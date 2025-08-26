'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  // evita open-redirect e define default
  const safe = (url: string | null) => {
    if (!url) return '/dashboard';
    if (!url.startsWith('/') || url.startsWith('//')) return '/dashboard';
    if (url === '/auth/callback') return '/dashboard';
    return url;
  };

  useEffect(() => {
    (async () => {
      try {
        // v2: troca o "code" por sessão e faz cleanup da URL
        await supabase.auth.exchangeCodeForSession();
      } catch {
        // ok, pode acontecer se já trocou ou se veio por implicit flow
      } finally {
        const to = safe(params.get('redirect'));
        router.replace(to);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="text-center space-y-2">
        <p className="text-lg">Concluindo login…</p>
        <p className="text-slate-500 text-sm">Você será redirecionada em instantes.</p>
      </div>
    </main>
  );
}
