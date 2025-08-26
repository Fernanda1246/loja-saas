'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

function ConfirmedInner() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const to = decodeURIComponent(search.get('redirect') || '/dashboard');

    // força o supabase-js a processar o hash de tokens e salvar a sessão
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(to);
    });

    // fallback: dispara assim que a sessão ficar disponível
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) router.replace(to);
    });

    return () => subscription.unsubscribe();
  }, [router, search]);

  return (
    <div className="grid min-h-[60vh] place-items-center p-6">
      <div className="text-center space-y-2">
        <p className="text-base font-medium">Conectando…</p>
        <p className="text-sm text-zinc-500">Finalizando seu login com o Google.</p>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmedInner />
    </Suspense>
  );
}
