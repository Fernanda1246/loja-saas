import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // redireciona sempre para o dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url));
}

// garante que a rota seja tratada no server (gera lambda)
export const dynamic = "force-dynamic";
export const revalidate = 0;
