import { createSupabaseServer } from '@/lib/supabase/server';

export default async function MfaPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <main style={{ padding: 24 }}>
      <h1>Configurar MFA</h1>
      <p>Olá, {user.email}</p>
    </main>
  );
}
