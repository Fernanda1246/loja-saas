// app/login/layout.tsx
// Não muda nada no visual. Apenas desliga o prerender da rota /login.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
