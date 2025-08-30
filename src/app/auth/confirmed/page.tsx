import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function ConfirmedPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/auth/confirmed");

  return (
    <main style={{ padding: 24 }}>
      <h1>Conta confirmada ✅</h1>
      <p>Sua autenticação foi concluída.</p>
    </main>
  );
}
