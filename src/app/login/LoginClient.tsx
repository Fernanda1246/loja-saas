// src/app/login/LoginClient.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") ?? "/dashboard";

  // Supabase client no browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === "SIGNED_IN") router.replace(redirect);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase, redirect, router]);

  // === SUA UI ATUAL DO LOGIN AQUI ===
  // (mantive o Auth + Google; sua estilização permanece igual)
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          magicLink
        />
      </div>
    </div>
  );
}
