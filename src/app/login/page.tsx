"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectDest = searchParams.get("redirect") || "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) {
        setErr(data?.error || "Falha ao entrar.");
        return;
      }
      router.replace(redirectDest);
    } catch (e: any) {
      setErr(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", background: "#f1f5f9", padding: 16 }}>
      <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: 380, background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,.06)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Entrar</h1>

        <label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>E-mail</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                 style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }} />
        </label>

        <label style={{ display: "grid", gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>Senha</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                 style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }} />
        </label>

        {err && <div style={{ color: "#b91c1c", fontSize: 13, marginBottom: 10 }}>{err}</div>}

        <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "none",
                         color: "#fff", background: loading ? "#0f766e99" : "#0f766e",
                         fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
