import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
  // SEMPRE crie o response e mexa nos cookies nele
  const response = NextResponse.next({ request: { headers: request.headers } });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // (ou PUBLISHABLE_KEY nas docs novas)
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: "", ...options, maxAge: 0 });
          },
        },
      }
    );

    // força refresh/validação do token e dispara os sets acima
    await supabase.auth.getUser();

    return response;
  } catch (e) {
    // não deixe o processo cair — loga e deixa passar
    console.error("[middleware] updateSession error:", e);
    return response;
  }
}
