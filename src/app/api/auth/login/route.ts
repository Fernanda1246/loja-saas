import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  const { email, password, redirectTo = "/dashboard" } = await request.json();

  // Base response no qual iremos setar as cookies
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // não precisamos ler aqui
          return [];
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 401 });

  // cookies já foram setadas em `res`, só redirecionar
  return NextResponse.redirect(new URL(redirectTo, request.url), { headers: res.headers });
}
