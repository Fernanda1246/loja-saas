// app/mfa/verify/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const CSS = `
.shell{min-height:100svh;display:grid;place-items:center;background:#f6f8fb;color:#0f172a;padding:6vh 1.25rem}
.card{width:min(100%,460px);background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 16px 60px rgba(15,23,42,.12);padding:2.25rem}
.title{text-align:center;font-weight:800;font-size:1.5rem;line-height:1.25;margin:0 0 .25rem}
.sub{text-align:center;color:#64748b;margin:0 0 1.75rem}
.field{display:grid;gap:.5rem;margin-top:1rem}
.input{height:48px;border:1px solid #e5e7eb;border-radius:12px;padding:0 1rem}
.btn{display:inline-flex;align-items:center;justify-content:center;height:46px;border-radius:12px;border:1px solid #e5e7eb;padding:0 1.1rem;font-weight:800}
.btn-primary{background:#0f766e;color:#fff;border-color:#0b5d58;width:100%;box-shadow:0 8px 20px rgba(20,184,166,.18)}
.alert{margin-top:1rem;border:1px solid #e5e7eb;border-radius:12px;padding:1rem}
`;

export default function MfaVerifyPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = useMemo<SupabaseClient | null>(() => (url && anon ? createClient(url, anon) : null), [url, anon]);

  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  // escolhe 1º TOTP e cria challenge
  useEffect(() => {
    (async () => {
      if (!supabase) return;
      const factors = await (supabase as any).auth.mfa.listFactors();
      if (factors.error) { setErr(factors.error.message); return; }
      const totp = factors.data?.totp?.[0];
      if (!totp) { setErr("Nenhum fator TOTP encontrado."); return; }
      setFactorId(totp.id);
      const challenge = await (supabase as any).auth.mfa.challenge({ factorId: totp.id });
      if (challenge.error) { setErr(challenge.error.message); return; }
      setChallengeId(challenge.data.id);
    })();
  }, [supabase]);

  async function verify() {
    setErr(null);
    if (!supabase || !factorId || !challengeId) return;
    setLoading(true);
    const resp = await (supabase as any).auth.mfa.verify({
      factorId,
      challengeId,
      code: code.trim(),
    });
    setLoading(false);
    if (resp.error) return setErr(resp.error.message);
    setOk(true);
    // sessão agora é AAL2 — segue para o app
    if (typeof window !== "undefined") window.location.replace("/dashboard");
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="shell">
        <section className="card">
          {!ok ? (
            <>
              <h1 className="title">Verificação em 2 passos</h1>
              <p className="sub">Digite o código do seu app autenticador.</p>
              <div className="field">
                <label htmlFor="code">Código</label>
                <input id="code" className="input" placeholder="123456" value={code} onChange={(e)=>setCode(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={verify} disabled={loading || !challengeId}>
                {loading ? "Verificando…" : "Confirmar"}
              </button>
              {err && <div className="alert" style={{ borderColor: "#fecaca", color:"#b91c1c" }}>{err}</div>}
              <div className="alert">
                <small>Problemas? <Link href="/mfa/setup">Configurar novamente</Link></small>
              </div>
            </>
          ) : (
            <div className="alert">Verificado! Redirecionando…</div>
          )}
        </section>
      </div>
    </>
  );
}
