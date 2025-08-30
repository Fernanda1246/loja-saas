import { createSupabaseServer } from '@/lib/supabase/server';

export default async function ConfirmedPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main style={{ padding: 24 }}>
      <h1>E-mail confirmado 🎉</h1>
      <p>{user?.email ? `Conta: ${user.email}` : 'Você já pode acessar sua conta.'}</p>
      <a href="/dashboard" style={{ color: '#0f766e', fontWeight: 700 }}>Ir para o dashboard</a>
    </main>
  );
}
