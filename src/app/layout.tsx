import "./globals.css";
import type { ReactNode } from "react";

export const metadata = { title: "App" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
