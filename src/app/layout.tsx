import "./globals.css";

export const metadata = { title: "App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-slate-50 font-sans antialiased">{children}</body>
    </html>
  );
}
