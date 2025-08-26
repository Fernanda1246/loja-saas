// middleware.ts (raiz)
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const AUTH_ROUTES = new Set([
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/check-email',
]);

const isPrivate = (pathname: string) =>
  pathname.startsWith('/dashboard') ||
  pathname.startsWith('/app') ||
  pathname.startsWith('/conta');

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const path = url.pathname;
  const search = url.search ?? '';

  // página pública de pós-login
  if (path.startsWith('/auth/confirmed')) {
    return res;
  }

  if (!session && isPrivate(path)) {
    const redirect = new URL('/login', url.origin);
    redirect.searchParams.set('redirect', `${path}${search}`);
    return NextResponse.redirect(redirect);
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
