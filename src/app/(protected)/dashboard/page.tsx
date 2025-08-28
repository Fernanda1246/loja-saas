// src/app/dashboard/page.tsx
import styles from "./dashboard.module.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Em Next 15, cookies() pode ser assíncrono no teu ambiente:
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Em Server Components não podemos mutar cookies; deixamos no-op:
        set(_name: string, _value: string, _options: any) {},
        remove(_name: string, _options: any) {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>

          <div className={styles.user}>
            <span className={styles.email}>{user.email}</span>
            <a href="/logout" className={styles.linkBtn}>
              Sair
            </a>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.grid}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Bem-vinda ✨</h2>
              <p className={styles.cardText}>
                Seu login deu tudo certo. Aqui você vai ver seus dados principais.
              </p>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Próximos passos</h2>
              <p className={styles.cardText}>
                Configure sua loja, cadastre produtos e conecte pagamentos.
              </p>
              <a href="/config" className={styles.linkBtn}>
                Ir para Configurações
              </a>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
