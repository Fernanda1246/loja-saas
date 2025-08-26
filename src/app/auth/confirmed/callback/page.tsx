'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/dashboard';

  useEffect(() => {
    let mounted = true;

    // Ao chamar getSession aqui, o supabase-js processa o #access_token
    // e persiste a sessão (localStorage/cookies), então o middleware passa
    supabase.auth.getSession().finally(() => {
      if (!mounted) return;
      router.replace(redirect);
      router.refresh();
    });

    return () => {
      mounted = false;
    };
  }, [redirect, router]);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center text-sm text-slate-600">
        Conectando… você será redirecionada em instantes.
      </div>
    </div>
  );
}

// Evita pre-render estático
export const dynamic = 'force-dynamic';
