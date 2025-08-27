"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Clock, CheckCircle2, DollarSign, Package, Inbox, TrendingUp, ArrowUpRight, ArrowDownRight, AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = { userEmail?: string };
type Range = "today" | "7d" | "30d";

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

const rangeLabel: Record<Range, string> = { today: "Hoje", "7d": "Últimos 7 dias", "30d": "Últimos 30 dias" };

const demoSales7 = [
  { date: "01", total: 180 }, { date: "02", total: 220 }, { date: "03", total: 120 },
  { date: "04", total: 260 }, { date: "05", total: 340 }, { date: "06", total: 290 }, { date: "07", total: 420 },
];

const demoSales30 = Array.from({ length: 30 }).map((_, i) => ({
  date: String(i + 1).padStart(2, "0"),
  total: Math.round(120 + Math.random() * 320),
}));

const demoOrders = [
  { number: "#1023", customer: "Ana Lima", date: "Hoje, 15:10", total: 129.9, status: "pendente" },
  { number: "#1022", customer: "Lucas Rocha", date: "Hoje, 11:42", total: 89.5, status: "entregue" },
  { number: "#1021", customer: "Marina Alves", date: "Ontem, 18:20", total: 239.0, status: "entregue" },
  { number: "#1020", customer: "Rafa Costa", date: "Ontem, 10:03", total: 59.9, status: "pendente" },
  { number: "#1019", customer: "Beatriz Prado", date: "02/09, 19:30", total: 199.0, status: "entregue" },
];

function RangeSwitch({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div className="flex items-center gap-2">
      {(["today", "7d", "30d"] as Range[]).map((r) => (
        <Button
          key={r}
          variant={value === r ? "default" : "secondary"}
          size="sm"
          className={value === r ? "" : "bg-white text-slate-700 hover:bg-slate-100"}
          onClick={() => onChange(r)}
          aria-label={`Filtrar período: ${rangeLabel[r]}`}
        >
          {rangeLabel[r]}
        </Button>
      ))}
    </div>
  );
}

function Delta({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <div className={`inline-flex items-center gap-1 text-sm font-medium ${positive ? "text-emerald-600" : "text-rose-600"}`}>
      {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
      {Math.abs(value).toFixed(1)}%
    </div>
  );
}

function KpiCard({
  icon, title, value, delta, onClick,
}: { icon: React.ReactNode; title: string; value: string; delta?: number; onClick?: () => void }) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" role="button" onClick={onClick} aria-label={`${title} — abrir detalhes`}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white grid place-content-center">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
          {typeof delta === "number" && <div className="mt-1"><Delta value={delta} /></div>}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ title, subtitle, icon, onClick }: { title: string; subtitle: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" role="button" onClick={onClick} aria-label={title}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-100 grid place-content-center text-slate-700">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-medium text-slate-900">{title}</div>
          <div className="text-sm text-slate-500">{subtitle}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Alerts({ lowStockCount, unreadOrdersCount, onViewStock, onViewOrders }: {
  lowStockCount: number; unreadOrdersCount: number; onViewStock: () => void; onViewOrders: () => void;
}) {
  return (
    <div className="space-y-3">
      <Card className="border-l-4 border-amber-400">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 grid place-content-center text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900">Estoque Baixo</div>
            <div className="text-sm text-slate-600">
              {lowStockCount} produto{lowStockCount === 1 ? "" : "s"} com estoque baixo
            </div>
          </div>
          <Button variant="outline" onClick={onViewStock}>Ver Detalhes</Button>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-rose-400">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-rose-50 grid place-content-center text-rose-600">
            <Inbox className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900">Pedidos Não Lidos</div>
            <div className="text-sm text-slate-600">
              Você tem {unreadOrdersCount} pedido{unreadOrdersCount === 1 ? "" : "s"} não lido{unreadOrdersCount === 1 ? "" : "s"}.
            </div>
          </div>
          <Button variant="outline" onClick={onViewOrders}>Ver Pedidos</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-slate-700">Vendas por dia</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickMargin={8} />
            <YAxis tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}`)} />
            <Tooltip formatter={(v: any) => currency(Number(v))} labelFormatter={(l) => `Dia ${l}`} />
            <Area dataKey="total" type="monotone" stroke="#06B6D4" fill="url(#fillSales)" strokeWidth={2} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function OrdersTable({ rows, onSeeAll }: { rows: typeof demoOrders; onSeeAll: () => void; }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base text-slate-700">Últimos Pedidos</CardTitle>
        <Button variant="ghost" className="text-slate-600" onClick={onSeeAll}>Ver todos</Button>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="text-sm text-slate-500 py-8 text-center">
            Sem pedidos ainda — crie seu primeiro produto.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 6).map((r) => (
                <TableRow key={r.number}>
                  <TableCell className="font-medium">{r.number}</TableCell>
                  <TableCell>{r.customer}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell className="text-right">{currency(r.total)}</TableCell>
                  <TableCell>
                    {r.status === "entregue" ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Entregue</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pendente</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardClient({ userEmail }: Props) {
  const router = useRouter();
  const [range, setRange] = useState<Range>("7d");

  const kpi = useMemo(() => {
    if (range === "today") {
      return { pending: 5, delivered: 12, sales: 2300, deltas: { pending: -4.3, delivered: 6.1, sales: 12.4 } };
    }
    if (range === "7d") {
      return { pending: 18, delivered: 64, sales: 12870, deltas: { pending: 2.1, delivered: 8.4, sales: 17.9 } };
    }
    return { pending: 67, delivered: 281, sales: 52130, deltas: { pending: -3.2, delivered: 5.7, sales: 9.6 } };
  }, [range]);

  const salesData = range === "30d" ? demoSales30 : range === "7d" ? demoSales7 : demoSales7.slice(-1);
  const lowStockCount = 3;
  const unreadOrdersCount = 2;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F8FAFC]">
      <div className="bg-gradient-to-r from-[#0F766E] via-[#13827A] to-[#06B6D4] text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="opacity-80">Bem-vinda{userEmail ? `, ${userEmail}` : ""} • {rangeLabel[range]}</p>
            </div>
            <RangeSwitch value={range} onChange={setRange} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 text-[#0F172A]">
        <section aria-label="Resumo de Pedidos" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard icon={<Clock className="h-6 w-6" />} title="Pedidos Pendentes" value={String(kpi.pending)} delta={kpi.deltas.pending} onClick={() => router.push("/orders?status=pending")} />
          <KpiCard icon={<CheckCircle2 className="h-6 w-6" />} title="Pedidos Entregues" value={String(kpi.delivered)} delta={kpi.deltas.delivered} onClick={() => router.push("/orders?status=delivered")} />
          <KpiCard icon={<DollarSign className="h-6 w-6" />} title="Total em Vendas" value={currency(kpi.sales)} delta={kpi.deltas.sales} onClick={() => router.push("/orders")} />
        </section>

        <section aria-label="Acesso Rápido" className="space-y-3">
          <div className="text-sm font-medium text-slate-600">Acesso Rápido</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction title="Cadastrar Produto" subtitle="Adicione novos itens ao catálogo" icon={<Package className="h-5 w-5" />} onClick={() => router.push("/products/new")} />
            <QuickAction title="Ver Estoque" subtitle="Gerencie produtos e estoque" icon={<TrendingUp className="h-5 w-5" />} onClick={() => router.push("/products")} />
            <QuickAction title="Ver Finanças" subtitle="Acompanhe receitas e despesas" icon={<DollarSign className="h-5 w-5" />} onClick={() => router.push("/analytics")} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <SalesChart data={salesData} />
          </div>
          <div className="lg:col-span-5">
            <OrdersTable rows={demoOrders} onSeeAll={() => router.push("/orders")} />
          </div>
        </section>

        <section aria-label="Avisos Importantes" className="space-y-3">
          <div className="text-sm font-medium text-slate-600">Avisos Importantes</div>
          <Alerts
            lowStockCount={lowStockCount}
            unreadOrdersCount={unreadOrdersCount}
            onViewStock={() => router.push("/products?stock=low")}
            onViewOrders={() => router.push("/orders?read=false")}
          />
        </section>
      </div>
    </div>
  );
}
