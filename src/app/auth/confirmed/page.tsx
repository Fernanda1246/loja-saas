'use client';
import Link from 'next/link';

export default function Confirmed() {
  return (
    <div className="p-6 space-y-3">
      <h2 className="text-xl font-semibold">E-mail confirmado!</h2>
      <p>Tudo certo — agora é só entrar.</p>
      <Link href="/login" className="underline">Ir para o login</Link>
    </div>
  );
}
