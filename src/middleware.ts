// middleware.ts (raiz do projeto)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/check-email",
]);

// rotas privadas que exigem sessão
function isPrivate(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/app") || pathname.startsWith("/conta");
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const path = url.pathname;

  // 1) bloquear rotas privadas sem sessão
  if (!session && isPrivate(path)) {
    const redirect = url.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("redirect", path);
    return NextResponse.redirect(redirect);
  }

  // 2) redirecionar usuário logado longe das páginas de auth (exceto reset)
  if (session && AUTH_ROUTES.has(path) && path !== "/reset-password") {
    const to = url.clone();
    to.pathname = "/dashboard"; // ajuste pro teu home logado
    return NextResponse.redirect(to);
  }

  return res;
}

// evita interceptar estáticos
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
