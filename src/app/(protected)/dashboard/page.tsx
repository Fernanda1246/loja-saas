'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400','500','600','700','800'],
});

// opcional: npm i lucide-react
import {
  Menu, X, LogOut, Search, Bell, HelpCircle, MoreHorizontal,
  Home, Receipt, Package, DollarSign, Users, BarChart3, Tags, Settings, Headset,
  FileSpreadsheet, Sparkles
} from 'lucide-react';

type KPI = { title: string; value: string; delta: number };
type Order = { id: string; customer: string; date: string; total: string; status: 'Pendente'|'Pago'|'Enviado'|'Entregue' };
type Timeframe = 'hora' | 'dia' | 'semana' | 'mes';
type DonutData = { label: string; value: number };

const kpis: KPI[] = [
  { title: 'Pedidos Pendentes', value: '18',  delta: 4.2 },
  { title: 'Pedidos Entregues', value: '126', delta: 8.1 },
  { title: 'Total em Vendas',   value: 'R$ 24.320', delta: 12.4 },
];

const lastOrders: Order[] = [
  { id: '#1029', customer: 'Ana Silva',   date: '30/08', total: 'R$ 189,90',  status: 'Pendente' },
  { id: '#1028', customer: 'João Pedro',  date: '30/08', total: 'R$ 299,00',  status: 'Pago' },
  { id: '#1027', customer: 'Marina Luz',  date: '29/08', total: 'R$ 78,50',   status: 'Enviado' },
  { id: '#1026', customer: 'Rafa Costa',  date: '29/08', total: 'R$ 1.259,00',status: 'Entregue' },
  { id: '#1025', customer: 'Laura N.',    date: '28/08', total: 'R$ 54,90',   status: 'Entregue' },
  { id: '#1024', customer: 'Carlos M.',   date: '28/08', total: 'R$ 420,00',  status: 'Pago' },
];

const actionsTop = [
  { label: 'Emitir Nota Fiscal', icon: FileSpreadsheet, href: '/fiscal/emitir-nota' },
  { label: 'Gerar link de pagamento', icon: DollarSign, href: '/pagamentos/gerar-link' },
  { label: 'Exportar pedidos (CSV)', icon: Sparkles, href: '/pedidos/exportar?fmt=csv' },
];

const nav = [
  { label: 'Início', icon: Home, href: '/dashboard' },
  { label: 'Pedidos', icon: Receipt, href: '/pedidos' },
  { label: 'Produtos', icon: Package, href: '/produtos' },
  { label: 'Finanças', icon: DollarSign, href: '/financas' },
  { label: 'Clientes', icon: Users, href: '/clientes' },
  { label: 'Relatórios', icon: BarChart3, href: '/relatorios' },
  { label: 'Cupons', icon: Tags, href: '/cupons' },
  { label: 'Configurações', icon: Settings, href: '/configuracoes' },
  { label: 'Suporte', icon: Headset, href: '/suporte' },
];

/* ===== série temporal ===== */
function getSeries(tf: Timeframe): number[] {
  switch (tf) {
    case 'hora':   return [4,5,6,8,7,6,5,7,9,10,9,11,12,13,12,14,13,12,11,10,9,8,7,6];
    case 'dia':    return [8,12,9,14,16,11,18,20,17,22,25,19,23,27];
    case 'semana': return [60,72,64,90,84,100,92,110];
    case 'mes':    return [120,140,135,160,170,165,190,210,205,220,230,240];
  }
  return [];
}
function getLabels(tf: Timeframe): string[] {
  if (tf === 'dia') {
    const len = 14;
    const today = new Date();
    return Array.from({ length: len }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (len - 1 - i));
      return String(d.getDate());
    });
  }
  switch (tf) {
    case 'hora':   return Array.from({ length: 24 }, (_, i) => `${i}h`);
    case 'semana': return ['S1','S2','S3','S4','S5','S6','S7','S8'];
    case 'mes':    return ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  }
  return [];
}

const donutCategorias: DonutData[] = [
  { label: 'Skincare', value: 46 },
  { label: 'Cabelo',   value: 28 },
  { label: 'Corpo',    value: 18 },
  { label: 'Outros',   value: 8 },
];
const donutOrigem: DonutData[] = [
  { label: 'Site',      value: 62 },
  { label: 'WhatsApp',  value: 21 },
  { label: 'Instagram', value: 17 },
];

/* ===== donuts / gauge ===== */
function useDonutPaths(data: DonutData[], radius = 60, stroke = 14) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return data.map((d) => {
    const frac = d.value / total;
    const len = circ * frac;
    const dasharray = `${len} ${circ - len}`;
    const dashoffset = circ * 0.25 - offset; // 12h
    offset += len;
    return { label: d.label, dasharray, dashoffset, radius, stroke };
  });
}
function useGauge(percent: number) {
  const r = 64;
  const full = 2 * Math.PI * r;
  const half = full / 2;
  const clamped = Math.max(0, Math.min(100, percent));
  const fill = (half * clamped) / 100;
  return { r, half, fill };
}

export default function DashboardPage() {
  const router = useRouter();

  /* drawer mobile */
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const el = drawerRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
      if (e.key !== 'Tab') return;
      if (document.activeElement === last && !e.shiftKey) { e.preventDefault(); first?.focus(); }
      if (document.activeElement === first && e.shiftKey) { e.preventDefault(); (last as HTMLElement)?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    first?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  /* série */
  const [tf, setTf] = useState<Timeframe>('dia');
  const values = useMemo(() => getSeries(tf), [tf]);
  const labels = useMemo(() => getLabels(tf), [tf]);

  /* geometria do gráfico */
  const chart = useMemo(() => {
    const w = 800, h = 300, pad = 16;
    const max = Math.max(...values) * 1.1;
    const min = Math.min(...values) * 0.8;
    const stepX = (w - pad * 2) / (values.length - 1);
    const toX = (i: number) => pad + i * stepX;
    const toY = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
    const d = values.map((v, i) => `${i ? 'L' : 'M'} ${toX(i)},${toY(v)}`).join(' ');
    const area = `${d} L ${toX(values.length - 1)},${h - pad} L ${toX(0)},${h - pad} Z`;
    const gridY = Array.from({ length: 4 }, (_, i) => pad + ((h - pad * 2) / 3) * i);
    // ticks do eixo X
    const tickCount = Math.min(8, values.length);
    const step = Math.max(1, Math.round(values.length / tickCount));
    const ticks = Array.from({ length: values.length }, (_, i) => i).filter(i => i % step === 0 || i === values.length - 1);
    return { w, h, pad, stepX, toX, toY, path: d, area, gridY, ticks };
  }, [values]);

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - rect.left - chart.pad) / chart.stepX);
    if (i >= 0 && i < values.length) setHoverIdx(i);
  };

  const gauge = useGauge(36);

  return (
    <div className={`${styles.wrapper} ${inter.className}`}>
      <header className={styles.topbar} role="banner">
        <div className={styles.barInner}>
          <button
            className={`${styles.iconBtn} ${styles.burger}`}
            aria-label="Abrir menu"
            aria-controls="dashboard-drawer"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} aria-hidden />
          </button>

          <div className={styles.brand}>
            <div className={styles.brandText}>
              <span className={styles.appTitle}>Dashboard</span>
              <span className={styles.appSubtitle}>Visão geral</span>
            </div>
          </div>

          <div className={styles.topbarRight}>
            <button className={`${styles.iconBtn} ${styles.ringTeal}`} aria-label="Notificações">
              <Bell size={18} />
            </button>
            <button className={`${styles.iconBtn} ${styles.ringOrange}`} aria-label="Ajuda">
              <HelpCircle size={18} />
            </button>
            <button onClick={() => router.push('/logout')} className={`${styles.signOutBtn} ${styles.ringAqua}`} title="Sair">
              <LogOut size={18} aria-hidden />
              <span>Sair</span>
            </button>
            <div className={styles.avatar} aria-label="Conta: Fernanda Croccetti" role="img">FC</div>
          </div>
        </div>
      </header>

      <aside className={styles.leftRail} aria-label="Navegação secundária">
        {nav.map(item => (
          <button key={item.label} className={styles.railBtn} onClick={() => router.push(item.href)} title={item.label}>
            <item.icon size={18} aria-hidden />
          </button>
        ))}
      </aside>

      {/* drawer mobile */}
      <div
        id="dashboard-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${menuOpen ? styles.isOpen : ''}`}
        role="dialog"
        aria-label="Menu"
        aria-hidden={!menuOpen}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button className={styles.iconBtn} aria-label="Fechar menu" onClick={() => setMenuOpen(false)}>
            <X size={20} aria-hidden />
          </button>
        </div>
        <nav className={styles.drawerNav}>
          {nav.map(item => (
            <button
              key={item.label}
              className={styles.drawerItem}
              onClick={() => { setMenuOpen(false); router.push(item.href); }}
            >
              <item.icon size={18} aria-hidden />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {menuOpen && <button aria-hidden className={styles.overlay} onClick={() => setMenuOpen(false)} tabIndex={-1} />}

      <main className={styles.content} role="main">
        <div className={styles.container}>
          {/* busca */}
          <div className={styles.searchRow}>
            <div className={styles.searchBox} role="search">
              <Search size={18} aria-hidden />
              <input className={styles.searchInput} placeholder="Buscar por qualquer coisa" aria-label="Buscar" />
            </div>
          </div>

          {/* ações */}
          <div className={styles.actionsBar} role="toolbar" aria-label="Ações rápidas">
            {actionsTop.map(a => (
              <button key={a.label} className={styles.actionChip} onClick={() => router.push(a.href)}>
                <a.icon size={16} aria-hidden />
                <span>{a.label}</span>
              </button>
            ))}
          </div>

          {/* KPIs */}
          <section className={styles.kpiGrid} aria-label="Indicadores">
            {kpis.map((k, i) => {
              const accent =
                i === 0 ? styles.kpiWarn : i === 1 ? styles.kpiTeal : styles.kpiAqua;
              return (
                <article key={k.title} className={`${styles.kpiCard} ${accent}`}>
                  <header className={styles.cardHeader}>
                    <h3 className={styles.kpiTitle}>{k.title}</h3>
                    <button className={styles.dotsBtn} aria-label="Mais opções"><MoreHorizontal size={16} /></button>
                  </header>
                  <div className={styles.kpiValue}>{k.value}</div>
                  <div className={`${styles.kpiDelta} ${k.delta >= 0 ? styles.deltaUp : styles.deltaDown}`}>
                    {k.delta >= 0 ? '+' : ''}{k.delta.toFixed(1)}%
                  </div>
                </article>
              );
            })}
            <article className={`${styles.kpiCard} ${styles.kpiSolid}`}>
              <header className={styles.cardHeader}>
                <h3 className={styles.kpiTitleAlt}>Mês atual</h3>
                <button className={styles.dotsBtnLight} aria-label="Mais opções"><MoreHorizontal size={16} /></button>
              </header>
              <div className={styles.kpiValueSolid}>R$ 2,0M</div>
              <div className={styles.kpiHint}>Meta: R$ 2,4M</div>
            </article>
          </section>

          {/* GRID principal */}
          <section className={styles.cardsGrid}>
            {/* Gráfico 8/12 */}
            <article className={`${styles.card} ${styles.cardLg}`}>
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Vendas</h3>
              </header>

              <svg
                viewBox={`0 0 ${chart.w} ${chart.h}`}
                className={`${styles.chartSvg} ${styles.chartLarge}`}
                role="img"
                aria-label={`Série temporal por ${tf}`}
                onMouseMove={onMove}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <defs>
                  <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%"  stopColor="rgba(14,106,99,0.32)" />
                    <stop offset="100%" stopColor="rgba(10,160,160,0.06)" />
                  </linearGradient>
                </defs>

                {chart.gridY.map((y, i) => (
                  <line key={i} x1="0" x2={chart.w} y1={y} y2={y} className={styles.gridLine} />
                ))}

                {hoverIdx !== null && (
                  <rect
                    x={chart.pad}
                    y={chart.pad}
                    width={Math.max(0, chart.pad + hoverIdx * chart.stepX - chart.pad)}
                    height={chart.h - chart.pad * 2}
                    className={styles.hoverShade}
                  />
                )}

                <path d={chart.area} fill="url(#areaFill)" />
                <path
                  d={chart.path}
                  className={styles.chartLine}
                  fill="none"
                  stroke="var(--teal-deep)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {values.map((v, i) => (
                  <circle key={i} cx={chart.pad + i * chart.stepX} cy={chart.toY(v)} r="2.5" className={styles.point} />
                ))}

                {/* rótulos do eixo X (todos os modos) */}
                {chart.ticks.map(i => (
                  <text key={i} x={chart.pad + i * chart.stepX} y={chart.h - 4} textAnchor="middle" className={styles.axisLabel}>
                    {labels[i]}
                  </text>
                ))}

                {/* linha + tooltip com rótulo e valor */}
                {hoverIdx !== null && (
                  <>
                    <line x1={chart.pad + hoverIdx * chart.stepX} x2={chart.pad + hoverIdx * chart.stepX}
                          y1={chart.pad} y2={chart.h - chart.pad} className={styles.hoverLine} />
                    <circle cx={chart.pad + hoverIdx * chart.stepX} cy={chart.toY(values[hoverIdx])} r="5" className={styles.hoverDot} />
                    <g transform={`translate(${chart.pad + hoverIdx * chart.stepX}, ${Math.max(24, chart.toY(values[hoverIdx]) - 28)})`}>
                      <rect x="-66" y="-18" width="132" height="24" rx="6" className={styles.tooltipBox} />
                      <text textAnchor="middle" alignmentBaseline="middle" className={styles.tooltipText}>
                        {(tf === 'hora' ? `${labels[hoverIdx]}` : tf === 'dia' ? `Dia ${labels[hoverIdx]}` : labels[hoverIdx])} — {values[hoverIdx]}
                      </text>
                    </g>
                  </>
                )}
              </svg>

              {/* abas embaixo */}
              <div className={styles.chartFooter}>
                <div className={styles.timeTabs} role="tablist" aria-label="Intervalo">
                  {(['hora','dia','semana','mes'] as Timeframe[]).map(opt => (
                    <button
                      key={opt}
                      role="tab"
                      aria-selected={tf === opt}
                      className={`${styles.timeTab} ${tf === opt ? styles.timeTabActive : ''}`}
                      onClick={() => setTf(opt)}
                    >
                      {opt === 'hora' ? 'Hora' : opt === 'dia' ? 'Dia' : opt === 'semana' ? 'Semana' : 'Mês'}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            {/* Gauge 4/12 */}
            <article className={`${styles.card} ${styles.cardSm}`}>
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Atingimento de meta</h3>
                <button className={styles.dotsBtn} aria-label="Mais opções"><MoreHorizontal size={16} /></button>
              </header>
              <div className={styles.gaugeWrap}>
                <svg viewBox="0 0 160 100" className={styles.gaugeSvg} role="img" aria-label="Medidor semicircular">
                  <g transform="translate(80,100)">
                    <circle r={gauge.r} cx="0" cy="0" className={styles.gaugeBg}  pathLength={Math.PI * gauge.r} />
                    <circle r={gauge.r} cx="0" cy="0" className={styles.gaugeFill}
                            pathLength={Math.PI * gauge.r}
                            strokeDasharray={`${gauge.fill} ${gauge.half - gauge.fill}`} strokeDashoffset="0" />
                    <line x1="0" y1="0" x2="0" y2={-gauge.r + 8}
                          className={styles.gaugeNeedle}
                          transform={`rotate(${(gauge.fill / gauge.half) * 180 - 90})`} />
                  </g>
                </svg>
                <div className={styles.gaugeValue}>36%</div>
              </div>
            </article>

            {/* Donuts 6+6 */}
            <article className={`${styles.card} ${styles.cardHalf}`}>
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Categorias mais vendidas</h3>
                <button className={styles.dotsBtn} aria-label="Mais opções"><MoreHorizontal size={16} /></button>
              </header>
              <div className={styles.donutRow}>
                <svg viewBox="0 0 160 160" className={styles.donutSvg} role="img" aria-label="Distribuição por categoria">
                  <g transform="translate(80,80) rotate(-90)">
                    {useDonutPaths(donutCategorias).map((s, i) => (
                      <circle
                        key={s.label} r={s.radius} cx="0" cy="0" fill="transparent"
                        stroke={i===0?'var(--teal)':i===1?'#0a857e':i===2?'#0aa0a0':'#f59e0b'}
                        strokeWidth={s.stroke} strokeDasharray={s.dasharray} strokeDashoffset={s.dashoffset}
                      />
                    ))}
                  </g>
                </svg>
                <ul className={styles.legend}>
                  {donutCategorias.map((d, i) => (
                    <li key={d.label} className={styles.legendItem}>
                      <span className={styles.legendSwatch}
                        style={{background:i===0?'var(--teal)':i===1?'#0a857e':i===2?'#0aa0a0':'#f59e0b'}} />
                      {d.label} — <b>{d.value}%</b>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className={`${styles.card} ${styles.cardHalf}`}>
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Origem das vendas</h3>
                <button className={styles.dotsBtn} aria-label="Mais opções"><MoreHorizontal size={16} /></button>
              </header>
              <div className={styles.donutRow}>
                <svg viewBox="0 0 160 160" className={styles.donutSvg} role="img" aria-label="Origem das vendas">
                  <g transform="translate(80,80) rotate(-90)">
                    {useDonutPaths(donutOrigem).map((s, i) => (
                      <circle
                        key={s.label} r={s.radius} cx="0" cy="0" fill="transparent"
                        stroke={i===0?'var(--teal)':i===1?'#0a857e':'#0aa0a0'}
                        strokeWidth={s.stroke} strokeDasharray={s.dasharray} strokeDashoffset={s.dashoffset}
                      />
                    ))}
                  </g>
                </svg>
                <ul className={styles.legend}>
                  {donutOrigem.map((d, i) => (
                    <li key={d.label} className={styles.legendItem}>
                      <span className={styles.legendSwatch}
                        style={{background:i===0?'var(--teal)':i===1?'#0a857e':'#0aa0a0'}} />
                      {d.label} — <b>{d.value}%</b>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* tabela cheia */}
            <article className={`${styles.card} ${styles.cardFull}`}>
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Últimos pedidos</h3>
                <button className={styles.dotsBtn} aria-label="Mais opções"><MoreHorizontal size={16} /></button>
              </header>
              <div className={styles.tableWrap} role="region" aria-label="Tabela de últimos pedidos">
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Pedido</th><th>Cliente</th><th>Data</th><th>Total</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastOrders.map(o => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.customer}</td>
                        <td>{o.date}</td>
                        <td>{o.total}</td>
                        <td><span className={`${styles.badge} ${styles[`st_${o.status}`]}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
