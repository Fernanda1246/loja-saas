import styles from "./dashboard.module.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </g>
    </svg>
  );
}
function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 6L9 17l-5-5" />
      </g>
    </svg>
  );
}
function IconMoney(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </g>
    </svg>
  );
}
function IconBox(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 22 16Z" />
        <path d="M2.5 7.5L12 13l9.5-5.5" />
      </g>
    </svg>
  );
}
function IconLayers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 10 5-10 5L2 7l10-5Z" />
        <path d="m2 17 10 5 10-5" />
        <path d="m2 12 10 5 10-5" />
      </g>
    </svg>
  );
}
function IconReceipt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21V3l2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2v18l-2-2-2 2-2-2-2 2-2-2-2 2-2-2-2 2Z" />
        <path d="M8 12h8M8 16h8M8 8h8" />
      </g>
    </svg>
  );
}
function IconBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </g>
    </svg>
  );
}
function IconStore(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l2-5h14l2 5" />
        <path d="M3 9h18v11H3z" />
        <path d="M7 9v11M17 9v11" />
      </g>
    </svg>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard");

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}><IconStore /></span>
          Loja Virtual
        </div>
        <div className={styles.userPill}>
          <span className={styles.avatar}>{(user.email ?? "U").slice(0,1).toUpperCase()}</span>
          <span className={styles.email}>{user.email}</span>
          <a href="/logout" className={styles.logout}>Sair</a>
        </div>
      </header>

      {/* Resumo */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <IconBell style={{marginRight:8}}/> Resumo de Pedidos
        </h2>
        <div className={styles.kpis}>
          <div className={`${styles.kpi} ${styles.kpiPending}`}>
            <IconClock />
            <div>
              <div className={styles.kpiValue}>5</div>
              <div className={styles.kpiLabel}>Pedidos Pendentes</div>
            </div>
          </div>
          <div className={`${styles.kpi} ${styles.kpiDelivered}`}>
            <IconCheck />
            <div>
              <div className={styles.kpiValue}>12</div>
              <div className={styles.kpiLabel}>Pedidos Entregues</div>
            </div>
          </div>
          <div className={`${styles.kpi} ${styles.kpiSales}`}>
            <IconMoney />
            <div>
              <div className={styles.kpiValue}>R$ 2.300,00</div>
              <div className={styles.kpiLabel}>Total em Vendas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Acesso rápido */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
        <div className={styles.quick}>
          <a className={styles.quickItem} href="/produtos/novo">
            <span className={styles.quickIcon}><IconBox /></span>
            <div>
              <div className={styles.quickTitle}>Cadastrar Produto</div>
              <div className={styles.quickDesc}>Adicione novos itens ao catálogo</div>
            </div>
          </a>

          <a className={styles.quickItem} href="/estoque">
            <span className={styles.quickIcon}><IconLayers /></span>
            <div>
              <div className={styles.quickTitle}>Ver Estoque</div>
              <div className={styles.quickDesc}>Gerencie produtos e estoque</div>
            </div>
          </a>

          <a className={styles.quickItem} href="/financeiro">
            <span className={styles.quickIcon}><IconMoney /></span>
            <div>
              <div className={styles.quickTitle}>Ver Finanças</div>
              <div className={styles.quickDesc}>Acompanhe receitas e despesas</div>
            </div>
          </a>

          <a className={styles.quickItem} href="/nfe/nova">
            <span className={styles.quickIcon}><IconReceipt /></span>
            <div>
              <div className={styles.quickTitle}>Lançar Nota Fiscal</div>
              <div className={styles.quickDesc}>Emita NFe rapidamente</div>
            </div>
          </a>
        </div>
      </section>

      {/* Alertas */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Avisos Importantes</h2>

        <div className={`${styles.alert} ${styles.alertWarn}`}>
          <div className={styles.alertLeft}></div>
          <div className={styles.alertBody}>
            <div className={styles.alertTitle}>Estoque Baixo</div>
            <div className={styles.alertText}>3 produtos com estoque baixo</div>
          </div>
          <a href="/estoque?f=baixo" className={styles.alertCta}>Ver Detalhes</a>
        </div>

        <div className={`${styles.alert} ${styles.alertInfo}`}>
          <div className={styles.alertLeft}></div>
          <div className={styles.alertBody}>
            <div className={styles.alertTitle}>Pedidos Não Lidos</div>
            <div className={styles.alertText}>Você tem 2 pedidos não lidos</div>
          </div>
          <a href="/pedidos?f=nao-lidos" className={styles.alertCta}>Ver Pedidos</a>
        </div>
      </section>
    </div>
  );
}
