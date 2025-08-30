import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Apenas mantém sessão/cookies atualizados.
  // A proteção do /dashboard fica no Server Component (redirect se não tiver user).
  return updateSession(request);
}

export const config = {
  // não processa assets estáticos
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
