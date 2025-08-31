"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { createSupabaseBrowser } from "@/lib/supabase/client";

/* ícones inline */
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 5c5.23 0 9.27 4.11 10 6.94-.73 2.83-4.77 6.94-10 6.94S2.73 14.77 2 11.94C2.73 9.11 6.77 5 12 5zm0 2c-3.9 0-7.22 2.79-8.21 4.94C4.78 14.09 8.1 16.88 12 16.88s7.22-2.79 8.21-4.94C19.22 9.79 15.9 7 12 7zm0 2.25A3.75 3.75 0 1 1 8.25 13 3.75 3.75 0 0 1 12 9.25z"
      />
    </svg>
  );
}
function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M2.1 3.51 3.52 2.1l18.38 18.39-1.41 1.41-3.1-3.1A11.6 11.6 0 0 1 12 18.88C6.77 18.88 2.73 14.77 2 11.94c.38-1.47 1.63-3.22 3.41-4.8L2.1 3.51ZM12 5c5.23 0 9.27 4.11 10 6.94-.3 1.17-1.14 2.6-2.39 3.94L17 13.27a3.74 3.74 0 0 0-4.27-4.27L9.47 6.74A12.57 12.57 0 0 1 12 5Zm0 6.25a1.75 1.75 0 0 1 1.75 1.75c0 .3-.07.58-.2.83l-2.38-2.38c.25-.13.53-.2.83-.2Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const redirectTo = qs.get("redirect") || "/dashboard";

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPw, setShowPw] = React.useState(false);

  const supabase = React.useMemo(() => createSupabaseBrowser(), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const email = String(form.get("email") || "");
      const password = String(form.get("password") || "");

      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, redirectTo }),
        redirect: "manual",
      });

      const ct = resp.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error(`Resposta não-JSON (status ${resp.status})`);
      const data = await resp.json();
      if (!resp.ok || !data?.ok) throw new Error(data?.error || "Falha no login");

      router.replace(data.redirectTo || "/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      const origin = window.location.origin;
      const redirectAbs = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectAbs, queryParams: { prompt: "consent", access_type: "offline" } },
      });
      if (error) setError(error.message);
    } catch (e: any) {
      setError(e.message || "Não foi possível iniciar o login com Google.");
    }
  }

  return (
    <main className={styles.page}>
      {/* Esquerda: hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Bem-vinda de volta!</h1>
          <p className={styles.heroText}>
            Gerencie pedidos, produtos e campanhas com praticidade.<br />
            Tudo em um só lugar — do jeitinho que lojista gosta.
          </p>
          <ul className={styles.heroList}>
            <li>Catálogo e estoque centralizados</li>
            <li>Acompanhamento de vendas em tempo real</li>
            <li>Recomendações inteligentes</li>
          </ul>
        </div>
      </section>

      {/* Direita: formulário */}
      <section className={styles.panel}>
        <div className={styles.card}>
          <div className={styles.brandBadge}>LJ</div>

          <h2 className={styles.title}>Entrar</h2>
          <p className={styles.sub}>Acesse sua conta para continuar.</p>

          <form onSubmit={onSubmit} className={styles.form} noValidate>
            <label className={styles.label}>
              <span className={styles.labelText}>E-mail</span>
              <input
                name="email"
                type="email"
                placeholder="seuemail@dominio.com"
                required
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Sua senha</span>
              <div className={styles.inputWrap}>
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Sua senha"
                  required
                  className={`${styles.input} ${styles.inputPw}`}
                />
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}

            <div className={styles.rowBetween}>
              <label className={styles.checkbox}>
                <input type="checkbox" /> <span>Lembrar de mim</span>
              </label>
              <a href="/forgot" className={styles.link}>Esqueci minha senha</a>
            </div>

            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className={styles.footerText}>
              Não tem conta? <a href="/signup" className={styles.link}>Criar conta</a>
            </div>
          </form>

          {/* Google — centralizado e por último */}
          <div className={styles.googleWrap}>
            <button
              type="button"
              className={styles.googleBtn}
              onClick={signInWithGoogle}
              aria-label="Entrar com Google"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className={styles.gIcon}>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.4 32.4 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.2-.1-2.5-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 16 18.8 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.1 4 9.2 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.1-5.1C29.2 35.8 26.7 37 24 37c-5 0-9.3-3.2-10.8-7.7l-6.6 5.1C9.2 39.7 16.1 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-5 6.5-9.3 6.5-5 0-9.3-3.2-10.8-7.7l-6.6 5.1C9.2 39.7 16.1 44 24 44c10 0 19-7.3 19-20 0-1.2-.1-2.5-.4-3.5z"/>
              </svg>
              Entrar com Google
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
