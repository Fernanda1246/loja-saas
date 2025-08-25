// app/check-email/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const GLOBAL_CSS = `
:root{
  --bg:#f6f8fb; --text:#0f172a; --muted:#64748b;
  --card:#ffffff; --border:#e5e7eb; --shadow:0 16px 60px rgba(15,23,42,.12);
  --primary:#0f766e; --primary-contrast:#ffffff; --ring:#14b8a6;
  --radius:16px; --space-1:.5rem; --space-2:.75rem; --space-3:1rem;
  --space-4:1.25rem; --space-5:1.75rem; --space-6:2.25rem;
  --font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Roboto, "Helvetica Neue", Arial, "Noto Sans";
}
*,*::before,*::after{box-sizing:border-box}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font)}
a{color:var(--primary);text-decoration:none} a:hover{text-decoration:underline}
.shell{min-height:100svh;display:grid;place-items:center;padding:6vh var(--space-4)}
.card{width:min(100%,460px);background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:var(--space-6)}
.badge{width:56px;height:56px;border-radius:999px;margin:0 auto var(--space-4);display:grid;place-items:center;color:#fff;font-size:22px;font-weight:800;background:linear-gradient(180deg, color-mix(in lab, var(--primary) 96%, #1b1) , color-mix(in lab, var(--primary) 70%, #000));box-shadow:0 8px 18px color-mix(in lab, var(--primary) 25%, transparent)}
.title{text-align:center;font-weight:800;font-size:clamp(1.25rem,1.05rem + .9vw,1.6rem);line-height:1.25;letter-spacing:-.01em;margin:0 0 .25rem}
.subtitle{text-align:center;color:var(--muted);font-size:.98rem;line-height:1.55;margin:0 0 var(--space-5)}
.stack{display:grid;gap:var(--space-4)}
.btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 1.1rem;border-radius:12px;border:1px solid var(--border);font-weight:800;letter-spacing:.01em;cursor:pointer;user-select:none;transition:transform .05s ease,filter .15s ease,box-shadow .15s ease,background .15s ease}
.btn:active{transform:translateY(1px)}
.btn-primary{background:var(--primary);color:var(--primary-contrast);border-color:color-mix(in lab,var(--primary)65%,black);box-shadow:0 8px 20px color-mix(in lab,var(--primary)18%,transparent);width:100%}
.btn-primary:hover{filter:brightness(1.03)}
.note{color:var(--muted);text-align:center;font-size:.95rem}
.row{display:grid;gap:var(--space-3)}
`;

export default function CheckEmailPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = useMemo<SupabaseClient | null>(() => (url && anon ? createClient(url, anon) : null), [url, anon]);

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const emailFromQuery = params?.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function resend() {
    if (!emailFromQuery || !supabase) return;
    setErr(null); setMsg(null);
    try {
      setLoading(true);
      // reenvia confirmação de cadastro
      const { error } = await (supabase as any).auth.resend({
        type: "signup",
        email: emailFromQuery.trim().toLowerCase(),
      });
      if (error) throw error;
      setMsg("Reenviado! Confira sua caixa de entrada e o spam.");
    } catch (e: any) {
      setErr(e?.message || "Não foi possível reenviar o e-mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="shell">
        <section className="card">
          <div className="stack">
            <div className="badge">✉️</div>
            <h1 className="title">Verifique seu e-mail</h1>
            <p className="subtitle">
              Enviamos um link. Abra sua caixa de entrada para continuar.
            </p>

            <div className="row">
              {emailFromQuery ? (
                <button className="btn btn-primary" onClick={resend} disabled={loading}>
                  {loading ? "Reenviando…" : `Reenviar para ${emailFromQuery}`}
                </button>
              ) : (
                <Link className="btn btn-primary" href="/forgot-password">Voltar para “Esqueci a senha”</Link>
              )}
              {msg && <p className="note">{msg}</p>}
              {err && <p className="note" style={{ color: "#b91c1c" }}>{err}</p>}
            </div>

            <p className="note">
              Já confirmou? <Link href="/login">Entrar</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
