import { NextResponse } from "next/server";

/**
 * Lambda mínima para existir /auth/confirmed
 * e redirecionar para a página visual.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = "/auth/confirmed-page"; // página visual
  return NextResponse.redirect(url);
}
