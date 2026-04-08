"use client";

import { useMemo, useState } from "react";
import { Archive, CalendarCheck2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { useFinanceStore } from "@/features/finance/store";
import { useGoalsStore } from "@/features/goals/store";
import { useHabitsStore } from "@/features/habits/store";
import { useMoodStore } from "@/features/mood/store";
import { buildMonthlySummary, buildWeeklySummary } from "@/services/analytics";
import { useReportsStore } from "./store";

export function ReportsPanel() {
  const moods = useMoodStore((state) => state.entries);
  const entries = useFinanceStore((state) => state.entries);
  const habits = useHabitsStore((state) => state.habits);
  const goals = useGoalsStore((state) => state.goals);
  const { weeklyArchive, monthlyArchive, archiveWeekly, archiveMonthlyAndRoll, activeMonthRef } =
    useReportsStore();
  const [tab, setTab] = useState<"overview" | "archive">("overview");

  const weekly = useMemo(
    () => buildWeeklySummary(new Date(), moods, entries, habits, goals),
    [entries, goals, habits, moods],
  );
  const monthly = useMemo(() => {
    const [year, month] = activeMonthRef.split("-");
    return buildMonthlySummary(
      new Date(Number(year), Number(month) - 1, 1),
      moods,
      entries,
      habits,
      goals,
    );
  }, [activeMonthRef, entries, goals, habits, moods]);

  const barData = [
    { name: "Humor Medio", value: Number(weekly.moodAverage.toFixed(2)) },
    { name: "Gastos Semana", value: Number(weekly.totalSpent.toFixed(2)) },
    { name: "Ofensiva Max", value: weekly.bestHabitStreak },
    { name: "Progresso Metas", value: Number(weekly.goalProgressAverage.toFixed(2)) },
  ];

  return (
    <Card title="Analytics & Reports">
      <div className="mb-4 flex gap-2">
        <Button variant={tab === "overview" ? "primary" : "secondary"} onClick={() => setTab("overview")}>
          Visao Atual
        </Button>
        <Button variant={tab === "archive" ? "primary" : "secondary"} onClick={() => setTab("archive")}>
          <Archive size={14} className="mr-1.5" />
          Arquivo
        </Button>
      </div>

      {tab === "overview" ? (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="mb-1 text-sm text-zinc-400">Resumo semanal</p>
              <p className="text-sm">Humor medio: {weekly.moodAverage.toFixed(2)}</p>
              <p className="text-sm">Gastos: {formatCurrency(weekly.totalSpent)}</p>
              <p className="text-sm">Ofensiva: {weekly.bestHabitStreak} dias</p>
              <p className="text-sm">Metas: {weekly.goalProgressAverage.toFixed(1)}%</p>
              <p className="mt-2 text-xs text-zinc-400">{weekly.insight}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="mb-1 text-sm text-zinc-400">Month Review ({activeMonthRef})</p>
              <p className="text-sm">Humor medio: {monthly.moodAverage.toFixed(2)}</p>
              <p className="text-sm">Gastos: {formatCurrency(monthly.totalSpent)}</p>
              <p className="text-sm">Ofensiva: {monthly.bestHabitStreak} dias</p>
              <p className="text-sm">Metas: {monthly.goalProgressAverage.toFixed(1)}%</p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="h-72 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3">
              <p className="mb-2 text-sm text-zinc-400">Humor x Gastos por dia</p>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={weekly.chart}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mood" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="spending" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="h-72 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3">
              <p className="mb-2 text-sm text-zinc-400">Indicadores semanais</p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={barData}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                archiveWeekly();
                toast.success("Resumo semanal arquivado.");
              }}
            >
              <CalendarCheck2 size={14} className="mr-1.5" />
              Arquivar Semana
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                archiveMonthlyAndRoll();
                toast.success("Month Review arquivado e ciclo mensal avancado.");
              }}
            >
              <CalendarClock size={14} className="mr-1.5" />
              Fechar Mes
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {weeklyArchive.length === 0 && monthlyArchive.length === 0 ? (
            <EmptyState
              title="Sem historico arquivado"
              description="Arquive uma semana ou mes para criar seu historico."
            />
          ) : null}

          <div>
            <p className="mb-2 text-sm font-semibold text-zinc-300">Semanas Arquivadas</p>
            <div className="space-y-2">
              {weeklyArchive.map((report, index) => (
                <div key={`${report.from}-${index}`} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
                  <p className="text-sm">{report.from} ate {report.to}</p>
                  <p className="text-xs text-zinc-400">
                    Humor {report.moodAverage.toFixed(2)} | Gastos {formatCurrency(report.totalSpent)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-zinc-300">Meses Arquivados</p>
            <div className="space-y-2">
              {monthlyArchive.map((report, index) => (
                <div key={`${report.from}-${index}`} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
                  <p className="text-sm">{report.from} ate {report.to}</p>
                  <p className="text-xs text-zinc-400">
                    Humor {report.moodAverage.toFixed(2)} | Gastos {formatCurrency(report.totalSpent)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
