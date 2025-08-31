"use client";

import * as React from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const CSS = `
:root{
  --bg:#f3f6f8; --ink:#0f172a; --muted:#5b6b7b; --line:#e5edf3;
  --card:#fff; --teal:#0f766e; --radius:16px; --shadow:0 18px 45px rgba(13,28,39,.10);
}
html,body{height:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.45 ui-sans-serif,system-ui,-apple-system,Segoe UI,Inter,Roboto,"Helvetica Neue",Arial}
*{box-sizing:border-box}
.shell{min-height:100svh;display:grid;place-items:center;padding:40px 16px}
.card{width:min(92vw,520px);background:var(--card);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow);padding:28px}
.title{margin:0 0 6px;font-weight:800;font-size:22px}
.sub{margin:0 0 18px;color:var(--muted)}
.field{display:grid;gap:8px;margin-bottom:14px}
.label{font-weight:600;color:var(--muted);font-size:.95rem}
.input{height:48px;width:100%;border:1px solid var(--line);border-radius:12px;padding:0 14px;background:#fff;font-size:16px;outline:none}
.input:focus{border-color:#cde2ef;box-shadow:0 0 0 4px #eaf4fb}
.btn{height:48px;width:100%;border-radius:12px;border:1px solid #0d6d66;background:linear-gradient(180deg,#0f766e,#0d6d66);color:#fff;font-weight:800;letter-spacing:.01em;cursor:pointer}
.btn[disabled]{opacity:.6;cursor:not-allowed}
.alert{margin-top:12px;padding:12px;border-radius:12px;border:1px solid #e5e7eb;background:#fff}
.alert.ok{border-color:rgba(20,184,166,.45)}
.alert.err{border-color:rgba(239,68,68,.45);color:#b91c1c}
.footer{margin-top:14px;color:var(--muted);text-align:center}
.footer a{color:#117a86;text-decoration:none}
.footer a:hover{text-decoration:underline}
`;

export default function ForgotPage() {
  const supabase = React.useMemo(() => createSupabaseBrowser(), []);
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null); setErr(null);
    try {
      setLoading(true);
      const origin = window.location.origin;
      // o link do e-mail vai abrir /reset
      const redirectTo = `${origin}/reset`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setOk("Enviamos um link para seu e-mail. Verifique sua caixa de entrada (ou spam).");
    } catch (e: any) {
      setErr(e?.message || "Não foi possível enviar o e-mail agora.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main className="shell">
        <section className="card">
          <h1 className="title">Esqueci minha senha</h1>
          <p className="sub">Informe seu e-mail e enviaremos um link para você redefinir a senha.</p>

          <form onSubmit={onSubmit}>
            <div className="field">
              <label className="label" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="seuemail@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Enviando…" : "Enviar link de redefinição"}
            </button>

            {ok && <div className="alert ok">{ok}</div>}
            {err && <div className="alert err">{err}</div>}

            <p className="footer">
              Lembrou a senha? <a href="/login">Voltar ao login</a>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}
