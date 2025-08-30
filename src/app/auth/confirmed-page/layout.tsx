// Server layout só deste segmento: deixa a rota ESTÁTICA
export const dynamic = "force-static";
export const revalidate = false; // sem ISR

export default function ConfirmedLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
