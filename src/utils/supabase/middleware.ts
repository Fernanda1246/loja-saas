import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Atualiza/propaga a sessão do Supabase em cada request.
 * Importante: escrevemos cookies no MESMO `response` retornado.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // publishable/anon
    {
      cookies: {
        // lê cookies da requisição
        getAll() {
          return request.cookies.getAll();
        },
        // grava no response que vamos retornar
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // Força refresh de token quando necessário e grava no `response`
  await supabase.auth.getUser();

  return response;
}
