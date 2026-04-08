import { Entry, getInstallments } from "@/features/finance/store";
import { Goal, getGoalProgress } from "@/features/goals/store";
import { Habit } from "@/features/habits/store";
import { calculateStreak } from "@/features/habits/utils/streak";
import { MoodEntry } from "@/features/mood/store";

export type AnalyticsSummary = {
  periodLabel: string;
  from: string;
  to: string;
  moodAverage: number;
  totalSpent: number;
  bestHabitStreak: number;
  goalProgressAverage: number;
  insight: string;
  chart: { date: string; mood: number; spending: number }[];
};

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfWeek(date: Date) {
  const base = new Date(date);
  const day = base.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  base.setDate(base.getDate() + diff);
  return base;
}

function endOfWeek(date: Date) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isWithin(isoDate: string, from: string, to: string) {
  return isoDate >= from && isoDate <= to;
}

function getDateRangeDays(from: string, to: string) {
  const days: string[] = [];
  const current = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  while (current <= end) {
    days.push(toISO(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function getMoodCorrelationInsight(
  moods: MoodEntry[],
  habits: Habit[],
  from: string,
  to: string,
) {
  const days = getDateRangeDays(from, to);
  const daysWithAllHabitsDone = days.filter((day) =>
    habits.length > 0 && habits.every((habit) => habit.doneDates.includes(day)),
  );
  const moodByDate = new Map(moods.map((entry) => [entry.date, entry.moodScore]));

  const withHabits = daysWithAllHabitsDone
    .map((day) => moodByDate.get(day))
    .filter((value): value is MoodEntry["moodScore"] => value !== undefined);
  const withoutHabits = days
    .filter((day) => !daysWithAllHabitsDone.includes(day))
    .map((day) => moodByDate.get(day))
    .filter((value): value is MoodEntry["moodScore"] => value !== undefined);

  if (withHabits.length === 0 || withoutHabits.length === 0) {
    return "Ainda nao ha dados suficientes para correlacao entre humor e habitos.";
  }

  const avgWithHabits = withHabits.reduce((acc, value) => acc + value, 0) / withHabits.length;
  const avgWithoutHabits =
    withoutHabits.reduce((acc, value) => acc + value, 0) / withoutHabits.length;
  const diff = ((avgWithHabits - avgWithoutHabits) / avgWithoutHabits) * 100;
  const absDiff = Math.abs(diff);
  const trend = diff >= 0 ? "melhor" : "pior";
  return `Neste periodo, seu humor foi ${absDiff.toFixed(0)}% ${trend} nos dias com todos os habitos concluidos.`;
}

function buildSummary(
  label: string,
  from: string,
  to: string,
  moods: MoodEntry[],
  entries: Entry[],
  habits: Habit[],
  goals: Goal[],
): AnalyticsSummary {
  const rangeMoods = moods.filter((mood) => isWithin(mood.date, from, to));
  const installments = getInstallments(entries).filter((item) => isWithin(item.dueDate, from, to));
  const totalSpent = installments
    .filter((item) => item.type === "saida")
    .reduce((acc, item) => acc + item.installmentAmount, 0);
  const moodAverage =
    rangeMoods.length > 0
      ? rangeMoods.reduce((acc, mood) => acc + mood.moodScore, 0) / rangeMoods.length
      : 0;
  const bestHabitStreak =
    habits.length > 0 ? Math.max(...habits.map((habit) => calculateStreak(habit.doneDates))) : 0;
  const goalProgressAverage =
    goals.length > 0
      ? goals.reduce((acc, goal) => acc + getGoalProgress(goal), 0) / goals.length
      : 0;

  const days = getDateRangeDays(from, to);
  const chart = days.map((date) => ({
    date,
    mood:
      rangeMoods.find((mood) => mood.date === date)?.moodScore ??
      0,
    spending: installments
      .filter((item) => item.type === "saida" && item.dueDate === date)
      .reduce((acc, item) => acc + item.installmentAmount, 0),
  }));

  return {
    periodLabel: label,
    from,
    to,
    moodAverage,
    totalSpent,
    bestHabitStreak,
    goalProgressAverage,
    insight: getMoodCorrelationInsight(rangeMoods, habits, from, to),
    chart,
  };
}

export function buildWeeklySummary(
  referenceDate: Date,
  moods: MoodEntry[],
  entries: Entry[],
  habits: Habit[],
  goals: Goal[],
) {
  const from = toISO(startOfWeek(referenceDate));
  const to = toISO(endOfWeek(referenceDate));
  return buildSummary("Resumo Semanal", from, to, moods, entries, habits, goals);
}

export function buildMonthlySummary(
  referenceDate: Date,
  moods: MoodEntry[],
  entries: Entry[],
  habits: Habit[],
  goals: Goal[],
) {
  const from = toISO(startOfMonth(referenceDate));
  const to = toISO(endOfMonth(referenceDate));
  return buildSummary("Month Review", from, to, moods, entries, habits, goals);
}
