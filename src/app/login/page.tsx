// src/app/login/page.tsx
import { Suspense } from "react";
import LoginClient from "./LoginClient";

// evita pre-render estático da rota de auth
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <LoginClient />
    </Suspense>
  );
}
