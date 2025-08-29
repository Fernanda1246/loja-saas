// app/mfa/setup/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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
.grid{display:grid;gap:1rem}
.badge{width:56px;height:56px;border-radius:999px;margin:0 auto 1.25rem;display:grid;place-items:center;color:#fff;font-size:22px;font-weight:800;background:linear-gradient(180deg,#0f766e,#0b5d58)}
.alert{margin-top:1rem;border:1px solid #e5e7eb;border-radius:12px;padding:1rem}
.code{display:grid;place-items:center;border:1px dashed #e5e7eb;border-radius:12px;padding:1rem;background:#fafafa}
.secret{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}
`;

export default function MfaSetupPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = useMemo<SupabaseClient | null>(() => (url && anon ? createClient(url, anon) : null), [url, anon]);

  const [factorId, setFactorId] = useState<string | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startEnroll() {
    setErr(null); setMsg(null);
    if (!supabase) return setErr("Supabase não configurado.");
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator",
    });
    if (error) return setErr(error.message);
    setFactorId(data.id);
    setUri(data.totp.uri);
    setQr(data.totp.qr_code);
    setSecret(data.totp.secret);
  }

  async function verify() {
    setErr(null); setMsg(null);
    if (!supabase || !factorId) return;
    setLoading(true);
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg("MFA (TOTP) ativado! Da próxima vez, pediremos o código.");
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="shell">
        <section className="card">
          <div className="badge">🔐</div>
          <h1 className="title">Ativar verificação em 2 passos</h1>
          <p className="sub">Use um app autenticador (Google/Microsoft Authenticator, 1Password…) para gerar códigos.</p>

          {!factorId ? (
            <button className="btn btn-primary" onClick={startEnroll}>Gerar QR code</button>
          ) : (
            <div className="grid">
              <div className="code">
                {/* o QR já vem como data URL */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr ?? ""} alt="QR code" width={212} height={212} />
                <div className="secret">
                  {uri ? <small>{uri}</small> : null}
                  {secret ? <div className="mt-1">Secret: <strong>{secret}</strong></div> : null}
                </div>
              </div>

              <div className="field">
                <label htmlFor="code">Código do app (6 dígitos)</label>
                <input id="code" className="input" placeholder="123456" value={code} onChange={(e)=>setCode(e.target.value)} />
              </div>

              <button className="btn btn-primary" disabled={loading} onClick={verify}>
                {loading ? "Verificando…" : "Confirmar e ativar"}
              </button>

              {msg && <div className="alert">{msg}</div>}
              {err && <div className="alert" style={{ borderColor: "#fecaca", color:"#b91c1c" }}>{err}</div>}

              <Link href="/dashboard" className="btn">Voltar</Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
