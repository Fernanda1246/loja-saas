import { redirect } from "next/navigation";
import { getSupabaseServer } from "./supabase/server";

export async function requireUser(redirectTo = "/login") {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`${redirectTo}?redirect=${encodeURIComponent("/dashboard")}`);
  return { supabase, user };
}
