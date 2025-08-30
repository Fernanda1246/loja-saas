'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '../../lib/supabase/client'; // <- relativo

export default function LogoutPage() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      await supabase.auth.signOut();
      router.replace('/login');
    };
    run();
  }, [router, supabase]);

  return null;
}
