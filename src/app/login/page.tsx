"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

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
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Se logar, redireciona
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
    if (error) setErr(error.message || "Não foi possível entrar. Tente novamente.");
    // sucesso: useEffect fará o redirect
  }

  async function handleGoogle() {
    setErr("");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?redirect=${redirect}` },
    });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md rounded-2xl shadow-lg bg-white p-6">
        <h1 className="text-[#0F172A] text-xl font-semibold mb-4 text-center">Entrar</h1>

        {err ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
            {err}
          </div>
        ) : null}

        <form onSubmit={handleEmailPassword} className="space-y-3">
          <div>
            <label className="block text-sm text-[#0F172A] mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 rounded-xl border border-slate-300 px-3 outline-none focus:border-[#06B6D4]"
              placeholder="nome@dominio.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#0F172A] mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 rounded-xl border border-slate-300 px-3 outline-none focus:border-[#06B6D4]"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#0F766E] hover:bg-[#13827A] text-white font-medium disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-slate-500 text-xs">ou</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full h-11 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#0F172A] font-medium"
        >
          Entrar com Google
        </button>

        <p className="mt-4 text-center text-sm">
          <a href="/forgot-password" className="text-[#0F766E] underline">
            Esqueci minha senha
          </a>
        </p>
      </div>
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
