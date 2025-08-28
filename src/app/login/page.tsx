// src/app/login/page.tsx  (Server Component)
export default function LoginPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const sp = new URLSearchParams(searchParams as any);
  const redirectTo = sp.get("redirect") ?? "/dashboard";
  const errorMsg = sp.get("error") || "";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F8FAFC]">
      <div className="hidden md:flex items-center justify-center p-10 bg-gradient-to-b from-[#0F766E] via-[#13827A] to-[#06B6D4] text-white">
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold mb-4">Acesse sua conta</h1>
          <p className="opacity-95">Tudo que você precisa para gerenciar sua loja.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl shadow-xl bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0F172A]">Entrar</h2>
          <p className="text-sm text-slate-600 mb-4">Faça login para continuar.</p>

          <form method="POST" action="/api/auth/login" className="space-y-4">
            <input type="hidden" name="redirect" value={redirectTo} />

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-slate-600">E-mail</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                     className="w-full rounded-xl border border-slate-300 px-3 h-11 outline-none focus:ring-2 focus:ring-[#06B6D4]" />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-slate-600">Senha</label>
              <input id="password" name="password" type="password" required autoComplete="current-password"
                     className="w-full rounded-xl border border-slate-300 px-3 h-11 outline-none focus:ring-2 focus:ring-[#06B6D4]" />
            </div>

            {!!errorMsg && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {errorMsg}
              </div>
            )}

            <button type="submit" className="w-full h-11 rounded-xl bg-[#13827A] text-white font-medium">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
