"use client";

import { useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import PasswordMeter from "@/components/PasswordMeter";

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
.field{display:grid;gap:.5rem}
label{font-size:.92rem;color:var(--muted);font-weight:600}
.input{width:100%;height:50px;background:#fff;border:1px solid var(--border);border-radius:12px;padding:0 1rem;font-size:1rem;color:var(--text);outline:none;transition:border-color .15s ease,box-shadow .15s ease}
.input::placeholder{color:rgba(100,116,139,.75)}
.input:focus{border-color:color-mix(in lab,var(--ring)55%,var(--border));box-shadow:0 0 0 4px color-mix(in lab,var(--ring)22%,transparent)}
.btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 1.1rem;border-radius:12px;border:1px solid var(--border);font-weight:800;letter-spacing:.01em;cursor:pointer;user-select:none;transition:transform .05s ease,filter .15s ease,box-shadow .15s ease,background .15s ease}
.btn:active{transform:translateY(1px)}
.btn-primary{background:var(--primary);color:var(--primary-contrast);border-color:color-mix(in lab,var(--primary)65%,black);box-shadow:0 8px 20px color-mix(in lab,var(--primary)18%,transparent);width:100%}
.btn-primary:hover{filter:brightness(1.03)}
.alert{display:grid;gap:.5rem;align-items:start;border:1px solid var(--border);border-radius:12px;padding:var(--space-3);background:#fff}
.alert .t{font-weight:800}
.alert.success{border-color:rgba(20,184,166,.45)}
.alert.danger{border-color:rgba(239,68,68,.45)}
.footer{margin-top:var(--space-4);text-align:center;color:var(--muted);font-size:.95rem}

/* dicas de senha */
.tips{margin-top:.5rem;color:var(--muted);font-size:.85rem;line-height:1.45}
.tips li{list-style:disc;margin-left:1rem}
`;

export default function SignupPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = useMemo<SupabaseClient | null>(() => (url && anon ? createClient(url, anon) : null), [url, anon]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isValidEmail = (v: string) => {
    if (typeof document === "undefined") return v.includes("@");
    const el = document.createElement("input"); el.type = "email"; el.value = v.trim(); return el.checkValidity();
  };

  async function signup() {
    setErr(null);
    if (!name.trim()) return setErr("Informe seu nome.");
    if (!isValidEmail(email)) return setErr("Informe um e-mail válido.");
    if (pw.length < 6) return setErr("A senha precisa ter pelo menos 6 caracteres.");
    if (!supabase) return setErr("Supabase não configurado.");

    try {
      setLoading(true);
      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/reset-password`;

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: pw,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo,
        },
      });
      if (error) throw error;
      setOk(true);
    } catch (e: any) {
      setErr(e?.message || "Não foi possível criar sua conta.");
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
            <form className="stack" onSubmit={(e)=>{e.preventDefault(); void signup();}} noValidate>
              <div className="badge">＋</div>
              <h1 className="title">Criar conta</h1>
              <p className="subtitle">Preencha seus dados para começar.</p>

              <div className="field">
                <label htmlFor="name">Nome completo</label>
                <input id="name" className="input" placeholder="Seu nome" value={name} onChange={(e)=>setName(e.target.value)} required />
              </div>

              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" className="input" type="email" placeholder="voce@dominio.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
              </div>

              <div className="field">
                <label htmlFor="pw">Senha</label>
                <input id="pw" className="input" type="password" placeholder="••••••" value={pw} onChange={(e)=>setPw(e.target.value)} minLength={6} required />
                <PasswordMeter value={pw} className="mt-2" />
                <ul className="tips">
                  <li>Use pelo menos <strong>10 caracteres</strong>.</li>
                  <li>Misture <strong>maiúsculas</strong> e <strong>minúsculas</strong>.</li>
                  <li>Inclua <strong>números</strong> e <strong>símbolos</strong> (ex.: !@#).</li>
                  <li>Evite <strong>dados pessoais</strong> (nome, data, telefone).</li>
                </ul>
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Criando…" : "Criar conta"}
              </button>

              {err && (
                <div className="alert danger" role="alert">
                  <div className="t">Não rolou</div>
                  <div>{err}</div>
                </div>
              )}

              <p className="footer">
                Já tem conta? <Link href="/login">Entrar</Link>
              </p>
            </form>
          ) : (
            <div className="stack" role="status" aria-live="polite">
              <div className="badge">✓</div>
              <h1 className="title">Verifique seu e-mail</h1>
              <p className="subtitle">Enviamos um link de confirmação. Depois de confirmar, volte e faça login.</p>
              <Link className="btn" href="/login">Ir para o login</Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
