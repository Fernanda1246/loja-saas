'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/** Ícones */
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 3l18 18M10.6 10.6a3 3 0 104.2 4.2M9.9 4.24C10.58 4.08 11.28 4 12 4c6.5 0 10 8 10 8a18.7 18.7 0 01-5.11 6.06M6.53 6.53A18.7 18.7 0 002 12s3.5 8 10 8c1.27 0 2.44-.21 3.5-.58"/>
    </svg>
  );
}

/** conteúdo que usa useSearchParams */
function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const safeRedirect = (url: string | null) => {
    if (!url) return '/dashboard';
    const isInternal = url.startsWith('/') && !url.startsWith('//');
    return isInternal ? url : '/dashboard';
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes('invalid login credentials')) setErr('E-mail ou senha incorretos.');
      else if (m.includes('email not confirmed')) setErr('Confirme seu e-mail para entrar.');
      else setErr('Não foi possível entrar. Tente novamente.');
      return;
    }

    if (data?.user) {
      const to = safeRedirect(params.get('redirect'));
      router.replace(to);
      router.refresh();
    }
  }

  /** GOOGLE OAUTH → redireciona para /auth/confirmed */
  async function handleGoogle() {
    setErr(null);
    try {
      const finalDest = safeRedirect(params.get('redirect')); // ex.: "/dashboard"
      const origin =
        typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL ?? '';
      const redirectTo = `${origin}/auth/confirmed?redirect=${encodeURIComponent(finalDest)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (e) {
      const msg = e instanceof Error ? e.message : null;
      setErr(msg || 'Não foi possível iniciar o login com Google.');
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8FAFC] text-[#0F172A]">
      {/* ... todo o seu markup do form exatamente como você já tem ... */}
      {/* Substitua só o onClick do botão Google: */}
      <button type="button" onClick={handleGoogle} className="...">
        {/* ícone e label */}
        Continuar com Google
      </button>
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
