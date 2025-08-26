'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/** Ícones (SVG, sem dependência) */
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

/** Conteúdo real da página (usa useSearchParams aqui dentro) */
function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // aceita só caminhos internos para evitar open-redirect
  function safeRedirect(url: string | null): string {
    if (!url) return '/dashboard';
    const isInternal = url.startsWith('/') && !url.startsWith('//');
    return isInternal ? url : '/dashboard';
  }

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
      router.refresh(); // garante re-render com a sessão nova
    }
  }

  // Google OAuth: deixa o Supabase fazer o callback e voltar direto para o destino final
  async function handleGoogle() {
    setErr(null);
    try {
      const redirect = safeRedirect(params.get('redirect')); // ex.: "/dashboard"
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}${redirect}` // ex.: http://localhost:3000/dashboard
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) throw error; // navegador redireciona pro Google
    } catch (e) {
      const msg = e instanceof Error ? e.message : null;
      setErr(msg || 'Não foi possível iniciar o login com Google.');
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8FAFC] text-[#0F172A]">
      {/* HERO ESQUERDO (desktop) */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E] via-[#13827A] to-[#06B6D4]" />
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          aria-hidden="true"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
        >
          <path d="M-20,500 C120,420 220,560 360,480 C500,400 620,520 780,440" fill="none" stroke="white" strokeWidth="2"/>
          <path d="M-20,420 C120,340 220,480 360,400 C500,320 620,440 780,360" fill="none" stroke="white" strokeWidth="1.5"/>
          <path d="M-20,340 C120,260 220,400 360,320 C500,240 620,360 780,280" fill="none" stroke="white" strokeWidth="1"/>
          {Array.from({ length: 60 }).map((_, i) => {
            const x = Math.random() * 800;
            const y = Math.random() * 600;
            return <circle key={i} cx={x} cy={y} r="2" fill="white" />;
          })}
        </svg>

        <div className="relative z-10 max-w-md px-10 py-12 text-white">
          <h1 className="text-3xl font-semibold">Acesse sua conta</h1>
          <p className="mt-3 text-white/90">
            Tudo que você precisa para gerenciar sua loja em um só lugar.
          </p>
          <ul className="mt-6 space-y-2 text-white/90">
            <li>• Catálogo e estoque centralizados</li>
            <li>• Acompanhamento de vendas em tempo real</li>
            <li>• Recomendações inteligentes</li>
          </ul>
        </div>
      </div>

      {/* CARD DE LOGIN (direita / mobile = única coluna) */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_12px_32px_rgba(2,6,23,0.08)] p-6 sm:p-8">
          <div className="mb-6">
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-[#13827A] text-white font-semibold">
              LJ
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Entrar</h2>
            <p className="mt-1 text-[#475569] text-sm">Faça login para continuar.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="sr-only" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-[#13827A]/30"
                placeholder="seuemail@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="password">Senha</label>
              <input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#13827A]/30"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto h-9 px-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] focus:outline-none"
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                title={show ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="min-h-[20px]">
              {err && <p className="text-sm text-red-600">{err}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#475569]">
                <input type="checkbox" className="rounded border-[#E2E8F0] text-[#13827A] focus:ring-[#13827A]" />
                Lembrar de mim
              </label>
              <Link href="/forgot-password" className="text-[#4F46E5] hover:opacity-80">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#13827A] text-white py-2.5 font-medium hover:bg-[#0F766E] disabled:opacity-60 transition-colors focus:ring-2 focus:ring-[#13827A]/30"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            <span className="text-xs text-[#64748B]">ou</span>
            <div className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 font-medium hover:bg-[#F1F5F9] transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C15.8 3 14 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4S6.9 20.6 12 20.6c6.9 0 9.6-4.8 9.2-9.3H12z"/>
            </svg>
            Continuar com Google
          </button>

          <p className="mt-6 text-center text-sm text-[#475569]">
            Não tem conta?{' '}
            <Link href="/signup" className="text-[#4F46E5] hover:opacity-80">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/** Wrapper exigido pelo Next 15 para páginas que usam useSearchParams */
export default function LoginPageWrapper() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

// evita pré-render estático em páginas de auth (opcional)
export const dynamic = 'force-dynamic';
