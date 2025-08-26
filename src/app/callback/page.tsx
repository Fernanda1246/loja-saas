'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/**
 * Callback para OAuth quando o provedor retorna com tokens no hash (#access_token).
 * O supabase.auth.getSession() no browser já lê o hash e ajusta a sessão local.
 * Depois redirecionamos para o destino solicitado (?redirect=...) ou /dashboard.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    async function finish() {
      // Isto força o Supabase a processar o hash (se presente) e persistir a sessão no client.
      await supabase.auth.getSession();

      const to = params.get('redirect') || '/dashboard';
      router.replace(to);
    }
    finish();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-[#0F172A]">
      Finalizando login…
    </div>
  );
}
