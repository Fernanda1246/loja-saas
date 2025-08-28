'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get('redirect') ?? '/dashboard';

  const supabase = React.useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === 'SIGNED_IN') router.replace(redirect);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase, redirect, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    router.replace(redirect);
  }

  async function handleGoogle() {
    setMsg(null);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main className={styles.wrapper}>
      {/* Lado esquerdo (hero) */}
      <section className={styles.left}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Bem-vinda de volta!</h1>
            <p className={styles.heroLead}>
              Gerencie pedidos, produtos e campanhas com praticidade.
              Tudo em um só lugar — do jeitinho que lojista gosta.
            </p>
            <ul className={styles.heroList}>
              <li>Catálogo e estoque centralizados</li>
              <li>Acompanhamento de vendas em tempo real</li>
              <li>Recomendações inteligentes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Lado direito (card de login) */}
      <section className={styles.right}>
        <div className={styles.formCard}>
          <div className={styles.brand}>LJ</div>
          <h2 className={styles.title}>Entrar</h2>
          <p className={styles.subtitle}>Acesse sua conta para continuar.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              <span className={styles.labelText}>E-mail</span>
              <input
                className={styles.input}
                type="email"
                required
                placeholder="seuemail@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Sua senha</span>
              <input
                className={styles.input}
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <div className={styles.actionsRow}>
              <label className={styles.checkbox}>
                <input type="checkbox" /> <span>Lembrar de mim</span>
              </label>
              <a className={styles.link} href="/forgot-password">
                Esqueci minha senha
              </a>
            </div>

            {msg && <div className={styles.feedback}>{msg}</div>}

            <button className={styles.submit} disabled={submitting}>
              {submitting ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          <button className={styles.provider} onClick={handleGoogle}>
            <GoogleIcon />
            <span>Entrar com Google</span>
          </button>

          <p className={styles.bottomNote}>
            Não tem conta? <a className={styles.link} href="/signup">Criar conta</a>
          </p>
        </div>
      </section>
    </main>
  );
}

/* ------------ Ícone do Google (SVG) ------------ */
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.9-6.4 8-11.3 8C16 36 10 30 10 22s6-14 14-14c3.6 0 6.9 1.4 9.4 3.6l5.7-5.7C35.4 2.1 30 0 24 0 10.7 0 0 10.7 0 24s10.7 24 24 24c12.9 0 23.6-10.4 23.6-23.2 0-1.6-.2-2.8-.4-4.3z"/>
      <path fill="#FF3D00" d="M0 24c0 7.3 3.5 13.8 9 18l6.6-5.4C12 34 10 29.5 10 24c0-5.5 2-10 5.6-12.6L9 6C3.5 10.2 0 16.7 0 24z"/>
      <path fill="#4CAF50" d="M24 48c6.5 0 12.4-2.5 16.7-6.5l-6.7-5.5C31.3 38 27.8 39.3 24 39.3c-4.9 0-9.1-2.7-11.3-6.7L6 38.9C10.3 44.2 16.7 48 24 48z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3C33.9 33.3 29.4 36 24 36c-4.9 0-9.1-2.7-11.3-6.7L6 38.9C10.3 44.2 16.7 48 24 48c12.9 0 23.6-10.4 23.6-23.2 0-1.6-.2-2.8-.4-4.3z"/>
    </svg>
  );
}
