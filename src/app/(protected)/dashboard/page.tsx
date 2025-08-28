'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = React.useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.brandLeft}>
          <IconStore className={styles.brandIcon} />
          <span className={styles.brandText}>Loja Virtual</span>
        </div>

        <div className={styles.userBox}>
          <span className={styles.userAvatar}>G</span>
          <span className={styles.userEmail}>{email ?? 'Sua conta'}</span>
          <button className={styles.btnGhost} onClick={handleLogout}>Sair</button>
        </div>
      </header>

      {/* KPIs */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <IconBell className={styles.titleIcon} />
          Resumo de Pedidos
        </h2>

        <div className={styles.kpis}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrap}><IconClock /></div>
            <div className={styles.kpiContent}>
              <div className={styles.kpiValue}>5</div>
              <div className={styles.kpiLabel}>Pedidos Pendentes</div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrap}><IconCheck /></div>
            <div className={styles.kpiContent}>
              <div className={styles.kpiValue}>12</div>
              <div className={styles.kpiLabel}>Pedidos Entregues</div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrap}><IconCurrency /></div>
            <div className={styles.kpiContent}>
              <div className={styles.kpiValue}>R$ 2.300,00</div>
              <div className={styles.kpiLabel}>Total em Vendas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visão Geral com gráficos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Visão Geral</h2>

        <div className={styles.grid2}>
          {/* Gráfico de linha (vendas semana) */}
          <div className={styles.cardChart}>
            <div className={styles.cardHead}>
              <div className={styles.cardTitle}>Vendas (últimos 7 dias)</div>
              <div className={styles.cardHint}>+12% vs. semana anterior</div>
            </div>
            <svg viewBox="0 0 300 120" className={styles.lineChart} aria-hidden="true">
              <polyline
                fill="none"
                stroke="#0f766e"
                strokeWidth="3"
                points="0,80 40,70 80,74 120,60 160,48 200,52 240,38 280,42"
              />
              <circle cx="280" cy="42" r="4" fill="#0f766e" />
            </svg>
          </div>

          {/* Barras por status */}
          <div className={styles.cardChart}>
            <div className={styles.cardHead}>
              <div className={styles.cardTitle}>Pedidos por Status</div>
              <div className={styles.cardHint}>Hoje</div>
            </div>
            <div className={styles.bars}>
              <div className={styles.bar}>
                <span>Pendentes</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFillAmber} style={{ width: '45%' }} />
                </div>
                <b>45</b>
              </div>
              <div className={styles.bar}>
                <span>Em trânsito</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFillBlue} style={{ width: '30%' }} />
                </div>
                <b>30</b>
              </div>
              <div className={styles.bar}>
                <span>Entregues</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFillGreen} style={{ width: '70%' }} />
                </div>
                <b>70</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acesso Rápido */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Acesso Rápido</h2>

        <div className={styles.quick}>
          <a className={styles.quickItem} href="#">
            <div className={styles.quickIcon}><IconBox /></div>
            <div className={styles.quickContent}>
              <div className={styles.quickTitle}>Cadastrar Produto</div>
              <div className={styles.quickHint}>Adicione novos itens ao catálogo</div>
            </div>
          </a>

          <a className={styles.quickItem} href="#">
            <div className={styles.quickIcon}><IconMoney /></div>
            <div className={styles.quickContent}>
              <div className={styles.quickTitle}>Ver Finanças</div>
              <div className={styles.quickHint}>Acompanhe receitas e despesas</div>
            </div>
          </a>

          <a className={styles.quickItem} href="#">
            <div className={styles.quickIcon}><IconStack /></div>
            <div className={styles.quickContent}>
              <div className={styles.quickTitle}>Ver Estoque</div>
              <div className={styles.quickHint}>Gerencie produtos e estoque</div>
            </div>
          </a>

          <a className={styles.quickItem} href="#">
            <div className={styles.quickIcon}><IconInvoice /></div>
            <div className={styles.quickContent}>
              <div className={styles.quickTitle}>Lançar Nota Fiscal</div>
              <div className={styles.quickHint}>Emita NFe rapidamente</div>
            </div>
          </a>
        </div>
      </section>

      {/* Avisos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Avisos Importantes</h2>

        <div className={styles.alert}>
          <div className={styles.alertStripeAmber} />
          <div className={styles.alertBody}>
            <div className={styles.alertTitle}>Estoque Baixo</div>
            <div className={styles.alertHint}>3 produtos com estoque baixo</div>
          </div>
          <a className={styles.btnSoft} href="#">Ver Detalhes</a>
        </div>

        <div className={styles.alert}>
          <div className={styles.alertStripeBlue} />
          <div className={styles.alertBody}>
            <div className={styles.alertTitle}>Pedidos Não Lidos</div>
            <div className={styles.alertHint}>Você tem 2 pedidos não lidos</div>
          </div>
          <a className={styles.btnSoft} href="#">Ver Pedidos</a>
        </div>
      </section>
    </div>
  );
}

/* ================== Ícones (SVG) ================== */

function IconStore(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M4 4h16l-1 5H5L4 4zm1 7h14v9H5v-9zm2 2v5h4v-5H7z" />
    </svg>
  );
}
function IconBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M12 2a6 6 0 0 0-6 6v3.5L5 14h14l-1-2.5V8a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z"/>
    </svg>
  );
}
function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1zm1 12h5v-2h-4V6h-2z"/>
    </svg>
  );
}
function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z"/>
    </svg>
  );
}
function IconCurrency(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M12 3a7 7 0 1 0 7 7h-2a5 5 0 1 1-5-5V3zm1 6h6V7h-6V3h-2v4H7v2h4v4h2z"/>
    </svg>
  );
}
function IconBox(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M21 8l-9-5-9 5 9 5 9-5zm-9 7L3 10v6l9 5 9-5v-6l-9 5z"/>
    </svg>
  );
}
function IconMoney(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M21 6H3v12h18V6zM7 9h10a3 3 0 0 0 3-3H4a3 3 0 0 0 3 3zm0 6a3 3 0 0 0-3 3h16a3 3 0 0 0-3-3H7zm5-7a4 4 0 1 1-4 4 4 4 0 0 1 4-4z"/>
    </svg>
  );
}
function IconStack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M12 2l10 5-10 5L2 7l10-5zm0 9l10 5-10 5-10-5 10-5z"/>
    </svg>
  );
}
function IconInvoice(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="M6 2h12v20l-6-3-6 3V2zm3 5h6v2H9V7zm0 4h6v2H9v-2z"/>
    </svg>
  );
}
