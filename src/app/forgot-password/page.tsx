// app/forgot-password/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* ====== UI / Paleta (alinhada ao app: fundo claro + teal) ====== */
const GLOBAL_CSS = `
:root{
  --bg:#f6f8fb; --text:#0f172a; --muted:#64748b;
  --card:#ffffff; --border:#e5e7eb; --shadow:0 16px 60px rgba(15,23,42,.12);

  --primary:#0f766e;           /* teal principal */
  --primary-contrast:#ffffff;
  --ring:#14b8a6;               /* foco/acento */

  --radius:16px;
  --space-1:.5rem; --space-2:.75rem; --space-3:1rem; --space-4:1.25rem; --space-5:1.75rem; --space-6:2.25rem;

  --font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Roboto, "Helvetica Neue", Arial, "Noto Sans";
}

*,*::before,*::after{box-sizing:border-box}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font)}
a{color:var(--primary);text-decoration:none} a:hover{text-decoration:underline}

/* ===== Layout centrado ===== */
.shell{min-height:100svh;display:grid;place-items:center;padding:6vh var(--space-4)}

/* ===== Card quadrado/compacto ===== */
.card{
  width:min(100%, 460px);
  background:var(--card);
  border:1px solid var(--border);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  padding:var(--space-6);
}

/* ===== Badge no topo (icone) ===== */
.badge{
  width:56px;height:56px;border-radius:999px;margin:0 auto var(--space-4);
  display:grid;place-items:center;
  color:#fff;font-size:22px;font-weight:800;
  background:linear-gradient(180deg, color-mix(in lab, var(--primary) 96%, #1b1) , color-mix(in lab, var(--primary) 70%, #000));
  box-shadow:0 8px 18px color-mix(in lab, var(--primary) 25%, transparent);
}

/* ===== Títulos: mais altos, sem achatar ===== */
.title{
  text-align:center;
  font-weight:800;
  font-size:clamp(1.25rem, 1.05rem + .9vw, 1.6rem);
  line-height:1.25;
  letter-spacing:-0.01em;
  margin:0 0 .25rem 0;
}
.subtitle{
  text-align:center;color:var(--muted);
  font-size:.98rem; line-height:1.55;
  margin:0 0 var(--space-5) 0;
}

/* ===== Form ===== */
.stack{display:grid;gap:var(--space-4)}
.field{display:grid;gap:.5rem}
label{font-size:.92rem;color:var(--muted);font-weight:600}
.input{
  width:100%; height:50px;
  background:#fff; border:1px solid var(--border);
  border-radius:12px; padding:0 1rem; font-size:1rem; color:var(--text);
  outline:none; transition:border-color .15s ease, box-shadow .15s ease;
}
.input::placeholder{color:rgba(100,116,139,.75)}
.input:focus{
  border-color:color-mix(in lab, var(--ring) 55%, var(--border));
  box-shadow:0 0 0 4px color-mix(in lab, var(--ring) 22%, transparent);
}

/* ===== Ações ===== */
.actions{display:grid;gap:var(--space-3)}
.btn{
  display:inline-flex;align-items:center;justify-content:center;
  height:46px;padding:0 1.1rem;border-radius:12px;border:1px solid var(--border);
  font-weight:800;letter-spacing:.01em;cursor:pointer;user-select:none;
  transition:transform .05s ease, filter .15s ease, box-shadow .15s ease, background .15s ease;
}
.btn:active{transform:translateY(1px)}
.btn-primary{
  background:var(--primary);color:var(--primary-contrast);
  border-color:color-mix(in lab, var(--primary) 65%, black);
  box-shadow:0 8px 20px color-mix(in lab, var(--primary) 18%, transparent);
  width:100%;
}
.btn-primary:hover{filter:brightness(1.03)}

/* ===== Alertas internos (mantém proporção do card) ===== */
.alert{display:grid;gap:.5rem;align-items:start;border:1px solid var(--border);border-radius:12px;padding:var(--space-3);background:#fff}
.alert .t{font-weight:800}
.alert.success{border-color:rgba(20,184,166,.45)}
.alert.danger{border-color:rgba(239,68,68,.45)}

.footer{margin-top:var(--space-4);text-align:center;color:var(--muted);font-size:.95rem}
`;

export default function ForgotPasswordPage() {
  // .env.local:
  // NEXT_PUBLIC_SUPABASE_URL=...
  // NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!url || !anon) return null;
    return createClient(url, anon);
  }, [url, anon]);

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/reset-password`;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // validação nativa de e-mail (evita regex quebrar build)
  const isValid = (v: string) => {
    if (typeof document === "undefined") return v.includes("@");
    const el = document.createElement("input");
    el.type = "email";
    el.value = v.trim();
    return el.checkValidity();
  };

  async function sendLink() {
    setErr(null);
    if (!isValid(email)) { setErr("Informe um e-mail válido."); return; }
    if (!supabase) { setErr("Supabase não configurado no .env."); return; }
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo }
      );
      if (error) throw error;
      setOk(true);
    } catch (e: any) {
      setErr(e?.message || "Erro ao enviar link. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div className="shell">
        <section className="card">
          {!ok ? (
            <form
              className="stack"
              onSubmit={(e) => { e.preventDefault(); void sendLink(); }}
              noValidate
            >
              <div className="badge">✦</div>
              <h1 className="title">Recuperar acesso</h1>
              <p className="subtitle">Digite seu e-mail para receber o link de redefinição.</p>

              <div className="field">
                <label htmlFor="fp-email">E-mail</label>
                <input
                  id="fp-email"
                  className="input"
                  type="email"
                  placeholder="seuemail@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!err}
                  aria-describedby={err ? "fp-error" : undefined}
                  required
                />
              </div>

              <div className="actions">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Enviando…" : "Enviar link"}
                </button>
              </div>

              {err && (
                <div className="alert danger" role="alert" id="fp-error">
                  <div className="t">Não rolou</div>
                  <div>{err}</div>
                </div>
              )}

              <p className="footer">
                Lembrou a senha? <Link href="/login">Entrar</Link>
              </p>
            </form>
          ) : (
            <div className="stack" role="status" aria-live="polite">
              <div className="badge">✓</div>
              <h1 className="title">Link enviado</h1>
              <p className="subtitle">Se o e-mail existir, você receberá o link em instantes.</p>

              <div className="actions">
                <Link className="btn" href="/login">Voltar ao login</Link>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => void sendLink()}
                  disabled={loading}
                >
                  Reenviar
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
