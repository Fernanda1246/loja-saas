// src/app/login/page.tsx
import { Suspense } from "react";
import LoginClient from "./LoginClient";

// Evita pre-render estático do /login (opcional, mas ajuda em auth)
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <LoginClient />
    </Suspense>
  );
}
