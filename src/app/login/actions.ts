"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

function sanitizeRedirect(to: string | null | undefined) {
  const fallback = "/dashboard";
  if (!to) return fallback;
  if (!to.startsWith("/") || to.startsWith("//")) return fallback;
  return to;
}

export type FormState = { ok: boolean; message?: string };

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = sanitizeRedirect(String(formData.get("redirect") || "/dashboard"));

  if (!email || !password) return { ok: false, message: "Informe e-mail e senha." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg =
      /Invalid login credentials/i.test(error.message)
        ? "Credenciais inválidas."
        : /Email not confirmed/i.test(error.message)
        ? "E-mail não confirmado."
        : "Não foi possível entrar. Tente novamente.";
    return { ok: false, message: msg };
  }

  redirect(redirectTo);
}
