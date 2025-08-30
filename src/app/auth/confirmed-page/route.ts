import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Conta confirmada</title>
<style>
  body{font-family:ui-sans-serif,system-ui;display:grid;place-items:center;min-height:100vh;background:#f8fafc;margin:0}
  .card{background:#fff;padding:24px 28px;border-radius:12px;box-shadow:0 10px 30px rgba(2,6,23,.08);max-width:560px}
  h1{margin:0 0 8px;font-size:24px}
  p{margin:0 0 16px;color:#334155}
  a{display:inline-block;background:#0f766e;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:700}
</style>
</head><body>
  <div class="card">
    <h1>E-mail confirmado 🎉</h1>
    <p>Seu cadastro foi confirmado com sucesso.</p>
    <a href="/dashboard">Ir para o dashboard</a>
  </div>
</body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
