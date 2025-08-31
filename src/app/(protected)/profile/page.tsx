// app/(protected)/profile/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ProfileForm from "./ProfileForm";
import styles from "./Profile.module.css";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  // IMPORTANTE: NÃO TOCAR NO PADRÃO DE SESSÃO/MIDDLEWARE DO PROJETO
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    // Mantemos simples: middleware já deve redirecionar para /login se não estiver autenticado
    // Aqui só garantimos um fallback visual.
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Perfil</h1>
          <p className={styles.errorText}>
            Não foi possível carregar o usuário. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) || "";
  const phone =
    (user?.user_metadata?.phone as string | undefined) || "";
  const email = user?.email || "";

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Perfil</h1>
        <p className={styles.subtitle}>
          Atualize suas informações básicas. (Não altera o fluxo de login.)
        </p>

        <div className={styles.infoBox}>
          <div>
            <span className={styles.label}>E-mail</span>
            <div className={styles.value}>{email}</div>
          </div>
          <div className={styles.tip}>
            Alteração de e-mail exige confirmação — podemos implementar depois,
            sem tocar no login atual.
          </div>
        </div>

        <ProfileForm
          initialFullName={fullName}
          initialPhone={phone}
        />
      </div>
    </div>
  );
}
