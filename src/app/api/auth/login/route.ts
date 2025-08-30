import { cookies as nextCookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function norm(opts: any) {
  const secure = process.env.NODE_ENV === "production";
  return { path: "/", sameSite: "lax", secure, ...opts };
}

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "E-mail e senha são obrigatórios." }, { status: 400 });
  }

  const reqCookies = await nextCookies();
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return reqCookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...norm(options) });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...norm(options), maxAge: 0 });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
  }

  // sb-access-token / sb-refresh-token são gravados via res.cookies.set
  return res;
}
