// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  const { email, password, redirectTo = "/dashboard" } = await request.json();

  // Base response no qual vamos setar as cookies
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ou publishable
    {
      cookies: {
        getAll() { return []; }, // não precisamos ler aqui
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const { error, data } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return new NextResponse(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 401, headers: res.headers }
    );
  }

  // ✅ JSON + cookies já setadas no mesmo response
  return new NextResponse(
    JSON.stringify({ ok: true, redirectTo, user: data.user }),
    { status: 200, headers: res.headers }
  );
}
