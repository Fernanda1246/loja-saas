// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const next = url.searchParams.get('redirect') || '/dashboard';

  const supabase = createRouteHandlerClient({ cookies });

  // Lê o fragmento (#access_token=...) e seta cookie de sessão do Supabase
  await supabase.auth.exchangeCodeForSession(url);

  // Redireciona para o destino final (ex.: /dashboard)
  return NextResponse.redirect(new URL(next, url.origin));
}
