import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(req: NextRequest) {
  return updateSession(req);
}

// NÃO intercepte /api nem assets; use matcher restrito
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/products/:path*",
    "/analytics/:path*",
  ],
};
