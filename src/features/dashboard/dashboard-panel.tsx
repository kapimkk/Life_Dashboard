"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Link2, Smile } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/features/auth/auth-provider";
import { getCurrentBalance, getInstallments, useFinanceStore } from "@/features/finance/store";
import { useGoalsStore } from "@/features/goals/store";
import { getHabitStreak, useHabitsStore } from "@/features/habits/store";
import { useMoodStore } from "@/features/mood/store";
import { useVaultStore } from "@/features/vault/store";
import { toISODate } from "@/features/habits/utils/streak";

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  href: string;
  ctaLabel?: string;
  children?: ReactNode;
};

function SummaryCard({ title, value, description, href, ctaLabel = "Ver detalhes", children }: SummaryCardProps) {
  return (
    <Card className="border-white/10 bg-zinc-900/70" title={title}>
      <p className="text-2xl font-semibold text-zinc-50">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
      {children}
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition hover:text-violet-200"
      >
        {ctaLabel}
        <ArrowUpRight size={16} />
      </Link>
    </Card>
  );
}

function getMoodMessage(average: number) {
  if (average >= 4.2) return "Semana de energia alta e estabilidade.";
  if (average >= 3.2) return "Humor equilibrado com oscilacoes leves.";
  return "Semana desafiadora. Priorize pausas curtas e recuperacao.";
}

function getLastSevenDaysMoodSummary(
  entries: ReturnType<typeof useMoodStore.getState>["entries"],
) {
  const today = new Date();
  const range = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const iso = toISODate(date);
    const found = entries.find((entry) => entry.date === iso);
    return { day: iso.slice(5), score: found?.moodScore ?? 0 };
  });
  return range;
}

export function DashboardPanel() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const searchTerm = (searchParams.get("q") ?? "").trim().toLowerCase();
  const habits = useHabitsStore((state) => state.habits);
  const goals = useGoalsStore((state) => state.goals);
  const entries = useFinanceStore((state) => state.entries);
  const balance = getCurrentBalance(entries);
  const moodEntries = useMoodStore((state) => state.entries);
  const vaultItems = useVaultStore((state) => state.items);

  const today = toISODate(new Date());
  const pendingToday = habits.filter((habit) => !habit.doneDates.includes(today)).slice(0, 3);
  const topHabits = habits
    .map((habit) => ({ ...habit, streak: getHabitStreak(habit) }))
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);
  const highestStreak = topHabits[0]?.streak ?? 0;

  const creditInstallments = getInstallments(entries).filter((item) => item.paymentMethod === "credito");
  const nextDueDate = creditInstallments
    .map((item) => item.dueDate)
    .filter((dueDate) => dueDate >= today)
    .sort()[0];
  const nextInvoiceTotal = nextDueDate
    ? creditInstallments
        .filter((item) => item.dueDate === nextDueDate && item.type === "saida")
        .reduce((total, installment) => total + installment.installmentAmount, 0)
    : 0;

  const weekMood = getLastSevenDaysMoodSummary(moodEntries);
  const validMood = weekMood.filter((item) => item.score > 0);
  const avgMood =
    validMood.length > 0 ? validMood.reduce((sum, item) => sum + item.score, 0) / validMood.length : 3;
  const moodMessage = getMoodMessage(avgMood);
  const latestVaultItems = vaultItems.slice(0, 3);
  const matchedHabits = searchTerm
    ? habits.filter((habit) => habit.title.toLowerCase().includes(searchTerm))
    : [];
  const matchedGoals = searchTerm
    ? goals.filter((goal) => goal.title.toLowerCase().includes(searchTerm))
    : [];
  const matchedTransactions = searchTerm
    ? entries.filter((entry) => entry.description.toLowerCase().includes(searchTerm))
    : [];
  const hasSearchResults =
    matchedHabits.length > 0 || matchedGoals.length > 0 || matchedTransactions.length > 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-100">Ola, {user?.name || "usuario"}!</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Seu resumo centralizado com o que precisa de atencao hoje.
        </p>
        {user?.onboarding?.mainGoal ? (
          <p className="mt-2 text-xs text-violet-300">
            Objetivo inicial: {user.onboarding.mainGoal}.
          </p>
        ) : null}
        {searchTerm ? (
          <p className="mt-2 text-xs text-zinc-500">
            Busca ativa por: <span className="text-zinc-300">{searchTerm}</span>
          </p>
        ) : null}
      </header>

      {searchTerm ? (
        <Card title="Resultados da busca" className="mb-4 border-white/10 bg-zinc-900/60">
          {hasSearchResults ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Habitos</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  {matchedHabits.length ? (
                    matchedHabits.slice(0, 5).map((habit) => <li key={habit.id}>{habit.title}</li>)
                  ) : (
                    <li className="text-zinc-500">Nenhum habito</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Metas</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  {matchedGoals.length ? (
                    matchedGoals.slice(0, 5).map((goal) => <li key={goal.id}>{goal.title}</li>)
                  ) : (
                    <li className="text-zinc-500">Nenhuma meta</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Transacoes</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  {matchedTransactions.length ? (
                    matchedTransactions.slice(0, 5).map((entry) => <li key={entry.id}>{entry.description}</li>)
                  ) : (
                    <li className="text-zinc-500">Nenhuma transacao</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <EmptyState
              title={`Nenhum resultado para "${searchTerm}"`}
              description="Tente um termo mais amplo para encontrar habitos, metas ou transacoes."
            />
          )}
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <SummaryCard
            title="Habitos"
            value={`${highestStreak} dias de ofensiva`}
            description="Maior ofensiva atual e pendencias de hoje."
            href="/habitos"
            ctaLabel="Gerenciar"
          >
            <ul className="mt-3 space-y-1 text-sm text-zinc-300">
              {pendingToday.length > 0 ? (
                pendingToday.map((habit) => (
                  <li key={habit.id} className="flex items-center justify-between">
                    <span>{habit.title}</span>
                    <span className="text-zinc-500">Pendente</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500">Sem habitos pendentes para hoje.</li>
              )}
            </ul>
          </SummaryCard>
        </div>

        <div className="md:col-span-6">
          <SummaryCard
            title="Financas"
            value={formatCurrency(balance)}
            description={
              nextDueDate
                ? `Proxima fatura em ${nextDueDate}: ${formatCurrency(nextInvoiceTotal)}`
                : "Sem faturas de credito pendentes."
            }
            href="/financas"
            ctaLabel="Ver detalhes"
          />
        </div>

        <div className="md:col-span-7">
          <SummaryCard
            title="Mood"
            value={`Media ${avgMood.toFixed(1)}/5`}
            description={moodMessage}
            href="/mood"
            ctaLabel="Ver detalhes"
          >
            <div className="mt-4 flex h-16 items-end gap-1">
              {weekMood.map((item) => (
                <div key={item.day} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-violet-500/80"
                    style={{ height: `${Math.max(8, item.score * 18)}%` }}
                  />
                  <span className="text-[10px] text-zinc-500">{item.day}</span>
                </div>
              ))}
            </div>
          </SummaryCard>
        </div>

        <div className="md:col-span-5">
          <SummaryCard
            title="Vault"
            value={latestVaultItems.length > 0 ? `${latestVaultItems.length} links recentes` : "Sem links recentes"}
            description="Acesso rapido aos ultimos itens salvos."
            href="/vault"
            ctaLabel="Abrir modulo"
          >
            <ul className="mt-3 space-y-1 text-sm text-zinc-300">
              {latestVaultItems.length > 0 ? (
                latestVaultItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 truncate">
                    <Link2 size={13} className="text-zinc-500" />
                    <span className="truncate">{item.title}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500">Salve links para ver seu resumo aqui.</li>
              )}
            </ul>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
              <Smile size={14} />
              Seus ultimos links ficam visiveis no command center.
            </div>
          </SummaryCard>
        </div>
      </div>
    </section>
  );
}
