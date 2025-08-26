// middleware.ts (raiz)
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const AUTH_ROUTES = new Set([
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/check-email',
  '/auth/confirmed', // <- NÃO bloquear
]);

const isPrivate = (p: string) =>
  p.startsWith('/dashboard') || p.startsWith('/app') || p.startsWith('/conta');

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const path = url.pathname;
  const search = url.search ?? '';

  if (!session && isPrivate(path)) {
    const to = new URL('/login', url);
    to.searchParams.set('redirect', `${path}${search}`);
    return NextResponse.redirect(to);
  }

  if (session && AUTH_ROUTES.has(path) && path !== '/reset-password') {
    return NextResponse.redirect(new URL('/dashboard', url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)',
  ],
};
