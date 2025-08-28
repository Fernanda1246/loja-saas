export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import { requireUser } from "../../lib/auth"; // ajuste para "@/lib/auth" se usa alias "@"

export default async function ProtectedLayout({
  children,
}: { children: ReactNode }) {
  await requireUser("/login"); // redireciona se não estiver logada
  return <>{children}</>;
}
