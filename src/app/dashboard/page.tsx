// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import DashboardClient from "./DashboardClient";
import { unstable_noStore as noStore } from "next/cache";

// 🔥 garanta render dinâmico no Vercel
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function DashboardPage() {
  noStore(); // evita cache em runtime

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect(`/login?redirect=${encodeURIComponent("/dashboard")}`);
  }

  return <DashboardClient userEmail={data.user.email ?? ""} />;
}
