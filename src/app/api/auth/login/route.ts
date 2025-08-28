export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const redirectTo = String(form.get("redirect") || "/dashboard");

  if (!email || !password) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Informe e-mail e senha.")}`, req.url),
      303
    );
  }

  // response de redirect que TAMBÉM receberá os Set-Cookie
  const to = new URL(redirectTo, req.url).toString();
  const res = NextResponse.redirect(to, 303);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
      cookieOptions: { path: "/", sameSite: "lax", secure: true },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg =
      /Invalid login credentials/i.test(error.message)
        ? "Credenciais inválidas."
        : /Email not confirmed/i.test(error.message)
        ? "E-mail não confirmado."
        : "Não foi possível entrar.";

    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(msg)}&redirect=${encodeURIComponent(redirectTo)}`,
        req.url
      ),
      303
    );
  }

  // ✅ cookies foram escritos no MESMO response; navegador segue para /dashboard
  return res;
}

// opcional, só para teste rápido da rota no navegador
export async function GET() {
  return new NextResponse("login route OK", { status: 200 });
}
