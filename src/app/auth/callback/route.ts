// src/app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const redirect = url.searchParams.get("redirect") ?? "/dashboard";

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  if (!code) {
    // Sem código do OAuth → volta pro login com erro
    const to = new URL(`/login?error=missing_code`, url.origin);
    return NextResponse.redirect(to);
  }

  // Troca o "code" por sessão e grava cookies httpOnly
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const to = new URL(`/login?error=callback_failed`, url.origin);
    return NextResponse.redirect(to);
  }

  // Redireciona pro destino final (padrão: /dashboard)
  const to = new URL(redirect, url.origin);
  return NextResponse.redirect(to);
}
