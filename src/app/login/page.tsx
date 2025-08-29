// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./login.module.css";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("Não foi possível entrar. Verifique suas credenciais.");
      return;
    }

    // força navegação completa já com a sessão
    if (typeof window !== "undefined") {
      window.location.href = redirect;
    }
  }

  return (
    <div className={styles.page}>
      {/* Lado esquerdo (hero em azul/gradiente) */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Bem-vindo de volta!
          <span className={styles.heroSubtitle}>
            Acesse sua conta para continuar
          </span>
        </h1>
      </section>

      {/* Lado direito (formulário) */}
      <section className={styles.formSide}>
        <div className={styles.card}>
          <h2 className={styles.title}>Login</h2>

          <form onSubmit={handleLogin} className={styles.form} autoComplete="on">
            {/* E-mail */}
            <label className={styles.label}>
              <span>E-mail</span>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
                autoComplete="email"
              />
            </label>

            {/* Senha + botão olho */}
            <label className={styles.label}>
              <span>Senha</span>
              <div className={styles.passwordWrap}>
                <input
                  className={styles.input}
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  className={styles.eyeBtn}
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? (
                    // olho fechado
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.64 1.82-3.12 3.17-4.35" />
                      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                      <path d="M6.1 6.1 1 1" />
                      <path d="m22.54 11.88c-1.3 2.59-4.55 6.12-10.54 6.12" />
                      <path d="M14.12 9.88a2 2 0 0 0-2.83-2.83" />
                      <path d="M17.94 6.06 22 2" />
                    </svg>
                  ) : (
                    // olho aberto
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
