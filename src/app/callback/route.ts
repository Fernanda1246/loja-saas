// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  let next = searchParams.get("redirect") || "/dashboard";
  if (!next.startsWith("/")) next = "/dashboard";

  const supabase = createRouteHandlerClient({ cookies });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=oauth`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
