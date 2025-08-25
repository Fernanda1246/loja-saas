'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (!data.user) router.replace('/login');
      else setEmail(data.user.email ?? null);
    });
    return () => { mounted = false; };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <p className="text-sm">Logada como: {email ?? '...'}</p>
      <button onClick={handleSignOut} className="px-4 py-2 rounded-md bg-zinc-900/10">
        Sair
      </button>
    </div>
  );
}
