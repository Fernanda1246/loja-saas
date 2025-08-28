import React from "react";
import { redirect } from "next/navigation";
import { cookies as getCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // ✅ Next 15.5 tipa como Promise → precisa de await
  const cookieStore = await getCookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // em Server Component não dá pra mutar cookies
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard");

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Olá, {user?.email}</p>
      <a href="/logout">Sair</a>
    </main>
  );
}
