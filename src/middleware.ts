import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/auth/confirmed", "/mfa"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // libera rotas públicas e infra
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||              // API liberada
    pathname.startsWith("/auth/callback") ||    // callback (se mantiver)
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/logout") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // protege as rotas definidas em PROTECTED
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasAccess = Boolean(req.cookies.get("sb-access-token")?.value);
  const hasRefresh = Boolean(req.cookies.get("sb-refresh-token")?.value);

  if (hasAccess || hasRefresh) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
