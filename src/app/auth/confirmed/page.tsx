'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ConfirmedInner() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const redirect = sp.get('redirect') || '/dashboard';
    router.replace(redirect);
  }, [router, sp]);

  return null;
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmedInner />
    </Suspense>
  );
}

// evita pré-render estático dessa página
export const dynamic = 'force-dynamic';
