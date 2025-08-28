'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ConfirmedInner() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const redirect = sp.get('redirect') || '/dashboard';
    // redireciono no cliente; a página pode ser estática tranquilamente
    router.replace(redirect);
  }, [router, sp]);

  return null;
}

export default function ConfirmedPage() {
  // Suspense é obrigatório quando se usa useSearchParams
  return (
    <Suspense fallback={null}>
      <ConfirmedInner />
    </Suspense>
  );
}
