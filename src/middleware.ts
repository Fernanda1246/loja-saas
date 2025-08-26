// middleware.ts (raiz)
import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Rotas públicas de autenticação
const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/check-email",
  // Se no futuro você voltar a usar uma página de callback:
  // "/auth/callback",
]);

// Quais caminhos exigem sessão
const isPrivate = (pathname: string) =>
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/app") ||
  pathname.startsWith("/conta");

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const path = url.pathname;
  const search = url.search ?? "";

  // 1) Bloqueia páginas privadas se não houver sessão
  if (!session && isPrivate(path)) {
    const redirect = new URL("/login", url.origin);
    // preserva o destino original (com querystring) para pós-login
    redirect.searchParams.set("redirect", `${path}${search}`);
    return NextResponse.redirect(redirect);
  }

  // 2) Se já está logada, evita ficar nas telas de auth (exceto reset)
  if (session && AUTH_ROUTES.has(path) && path !== "/reset-password") {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  return res;
}

// Não interceptar assets, imagens, favicon, robots/sitemap e API routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)",
  ],
};
