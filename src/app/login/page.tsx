"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import styles from "./login.module.css";

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

  // após logar, redireciona
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
      {/* Coluna esquerda (hero) */}
      <aside className={styles.hero}>
        <div className={styles.heroInner}>
          <h2 className={styles.heroTitle}>Bem-vinda de volta!</h2>
          <p className={styles.heroText}>
            Gerencie pedidos, produtos e campanhas com praticidade.
            Tudo em um só lugar — do jeitinho que lojista gosta.
          </p>

          <ul className={styles.heroList}>
            <li>Catálogo e estoque centralizados</li>
            <li>Acompanhamento de vendas em tempo real</li>
            <li>Recomendações inteligentes</li>
          </ul>
        </div>
      </aside>

      {/* Coluna direita (card) */}
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
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </label>

            <div className={styles.row}>
              <label className={styles.remember}>
                <input type="checkbox" /> Lembrar de mim
              </label>
              <a className={styles.linkSm} href="/forgot-password">
                Esqueci minha senha
              </a>
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
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
