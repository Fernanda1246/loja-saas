"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import styles from "./login.module.css";

/* Ícones neutros (SVG) */
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
        <circle cx="12" cy="12" r="3" />
      </g>
    </svg>
  );
}
function EyeOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a3 3 0 0 0 4.24 4.24" />
        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a19.28 19.28 0 0 1-5.09 5.59" />
        <path d="M6.61 6.61A19.42 19.42 0 0 0 1 12s4 7 11 7a10.94 10.94 0 0 0 2.12-.21" />
      </g>
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") ?? "/dashboard";

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === "SIGNED_IN") router.replace(redirect);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase, redirect, router]);

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message || "Não foi possível entrar.");
  }

  async function handleGoogle() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?redirect=${redirect}` },
    });
  }

  return (
    <div className={styles.shell}>
      {/* Hero */}
      <aside className={styles.hero}>
        <div className={styles.heroInner}>
          <h2 className={styles.heroTitle}>Bem-vinda de volta!</h2>
          <p className={styles.heroText}>
            Gerencie pedidos, produtos e campanhas com praticidade. Tudo em um só lugar — do jeitinho que lojista gosta.
          </p>
          <ul className={styles.heroList}>
            <li>Catálogo e estoque centralizados</li>
            <li>Acompanhamento de vendas em tempo real</li>
            <li>Recomendações inteligentes</li>
          </ul>
        </div>
      </aside>

      {/* Card */}
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.brandCircle}>LJ</div>
          <h1 className={styles.title}>Entrar</h1>
          <p className={styles.subtitle}>Acesse sua conta para continuar.</p>

          {err ? <div className={styles.error}>{err}</div> : null}

          <form onSubmit={handleEmailPassword} className={styles.form}>
            <label className={styles.label}>
              E-mail
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seuemail@dominio.com"
              />
            </label>

            <label className={styles.label}>
              Sua senha
              <div className={styles.passwordWrap}>
                <input
                  className={styles.input}
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••"
                />
                <button
                  type="button"
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  className={styles.eye}
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>

            <div className={styles.row}>
              <label className={styles.remember}>
                <input type="checkbox" /> Lembrar de mim
              </label>
              <a className={styles.linkSm} href="/forgot-password">Esqueci minha senha</a>
            </div>

            <button className={styles.button} disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <div className={styles.divider}><span>ou</span></div>

          <button className={styles.provider} onClick={handleGoogle}>
            Entrar com Google
          </button>

          <p className={styles.footerHint}>
            Não tem conta? <a className={styles.linkSm} href="/signup">Criar conta</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><LoginContent /></Suspense>;
}
