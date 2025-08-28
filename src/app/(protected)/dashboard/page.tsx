"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css";
import { createBrowserClient } from "@supabase/ssr";

/** Ícones inline (SVG) */
const IconStore = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M3 9h18l-1 11H4L3 9Zm.5-5h17l1.5 4H2l1.5-4Zm5.5 10v5h6v-5H9Z"/>
  </svg>
);
const IconMail = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/>
  </svg>
);
const IconClock = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm1 11h5v2h-7V6h2Z"/>
  </svg>
);
const IconCheck = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z"/>
  </svg>
);
const IconMoney = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Zm-6 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z"/>
  </svg>
);
const IconBox = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}>
    <path fill="currentColor" d="m21 16-9 5-9-5V8l9 5 9-5v8Zm-9-7L3 4l9-5 9 5-9 5Z"/>
  </svg>
);
const IconCash = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M3 6h18v12H3zM5 8v8h14V8H5Zm7 1a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z"/>
  </svg>
);
const IconDoc = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8Zm1 7V3.5L19.5 9ZM8 11h8v2H8Zm0 4h8v2H8Z"/>
  </svg>
);

/** Gera o path de um sparkline simples */
function sparkPath(data: number[], w: number, h: number, pad = 6) {
  if (!data.length) return "";
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = Math.max(1, max - min);
  const stepX = (w - pad * 2) / (data.length - 1);

  return data
    .map((v, i) => {
      const x = pad + i * stepX;
      const norm = (v - min) / span;
      const y = h - pad - norm * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export default function DashboardPage() {
  const supabase = useMemo(
    () => createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ),
    []
  );

  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, [supabase]);

  // Dados mock para os cards e gráficos
  const kpis = [
    { icon: <IconClock />, value: 5, label: "Pedidos Pendentes", tone: styles.kpiAmber },
    { icon: <IconCheck />, value: 12, label: "Pedidos Entregues", tone: styles.kpiGreen },
    { icon: <IconMoney />, value: "R$ 2.300,00", label: "Total em Vendas", tone: styles.kpiBlue },
  ];

  const sales = [12, 14, 9, 11, 15, 13, 18, 17, 20, 22, 19, 24];
  const orders = [8, 5, 10, 7, 12, 9, 14];

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.brandLeft}>
          <span className={styles.brandBadge}><IconStore /></span>
          <span className={styles.brandTitle}>Loja Virtual</span>
        </div>

        <div className={styles.userBox}>
          <span className={styles.userEmail}>
            <IconMail className={styles.userIcon} /> {email || "—"}
          </span>
          <a className={styles.signOut} href="/logout">Sair</a>
        </div>
      </header>

      {/* Resumo de pedidos / KPIs */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Resumo de Pedidos</h2>

        <div className={styles.kpiGrid}>
          {kpis.map((k, i) => (
            <article className={styles.kpiCard} key={i}>
              <div className={`${styles.kpiIcon} ${k.tone}`}>{k.icon}</div>
              <div className={styles.kpiContent}>
                <div className={styles.kpiValue}>{k.value}</div>
                <div className={styles.kpiLabel}>{k.label}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Acesso rápido */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Acesso Rápido</h2>

        <div className={styles.quickGrid}>
          <a className={styles.quickCard} href="#">
            <span className={`${styles.quickIcon} ${styles.toneTeal}`}><IconBox /></span>
            <div className={styles.quickText}>
              <h3 className={styles.quickTitle}>Cadastrar Produto</h3>
              <p className={styles.quickDesc}>Adicione novos itens ao catálogo</p>
            </div>
          </a>

          <a className={styles.quickCard} href="#">
            <span className={`${styles.quickIcon} ${styles.toneIndigo}`}><IconBox /></span>
            <div className={styles.quickText}>
              <h3 className={styles.quickTitle}>Ver Estoque</h3>
              <p className={styles.quickDesc}>Gerencie produtos e estoque</p>
            </div>
          </a>

          <a className={styles.quickCard} href="#">
            <span className={`${styles.quickIcon} ${styles.toneGreen}`}><IconCash /></span>
            <div className={styles.quickText}>
              <h3 className={styles.quickTitle}>Ver Finanças</h3>
              <p className={styles.quickDesc}>Acompanhe receitas e despesas</p>
            </div>
          </a>

          <a className={styles.quickCard} href="#">
            <span className={`${styles.quickIcon} ${styles.toneBlue}`}><IconDoc /></span>
            <div className={styles.quickText}>
              <h3 className={styles.quickTitle}>Lançar Nota Fiscal</h3>
              <p className={styles.quickDesc}>Emita NFe rapidamente</p>
            </div>
          </a>
        </div>
      </section>

      {/* Gráficos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Visão Geral</h2>

        <div className={styles.chartsGrid}>
          <article className={styles.chartCard}>
            <div className={styles.chartHead}>
              <h3 className={styles.chartTitle}>Vendas (últimos 12 meses)</h3>
              <span className={styles.badgeUp}>+12%</span>
            </div>
            <svg className={styles.spark} viewBox="0 0 400 120" preserveAspectRatio="none">
              <path d={sparkPath(sales, 400, 120)} className={styles.sparkLine}/>
              {/* preenchimento suave */}
              <path
                d={`${sparkPath(sales, 400, 120)} L394,114 L6,114 Z`}
                className={styles.sparkFill}
              />
            </svg>
          </article>

          <article className={styles.chartCard}>
            <div className={styles.chartHead}>
              <h3 className={styles.chartTitle}>Pedidos (últimos 7 dias)</h3>
              <span className={styles.badgeNeutral}>Estável</span>
            </div>

            <div className={styles.barsWrap}>
              {orders.map((v, i) => (
                <div className={styles.barItem} key={i}>
                  <div className={styles.bar} style={{ height: 12 + v * 6 }} />
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* Avisos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Avisos Importantes</h2>

        <div className={styles.noticeList}>
          <article className={`${styles.noticeCard} ${styles.noticeWarn}`}>
            <div className={styles.noticeBody}>
              <h3 className={styles.noticeTitle}>Estoque Baixo</h3>
              <p className={styles.noticeMeta}>3 produtos com estoque baixo</p>
            </div>
            <a className={styles.noticeAction} href="#">Ver Detalhes</a>
          </article>

          <article className={`${styles.noticeCard} ${styles.noticeInfo}`}>
            <div className={styles.noticeBody}>
              <h3 className={styles.noticeTitle}>Pedidos Não Lidos</h3>
              <p className={styles.noticeMeta}>Você tem 2 pedidos não lidos</p>
            </div>
            <a className={styles.noticeAction} href="#">Ver Pedidos</a>
          </article>
        </div>
      </section>
    </div>
  );
}
