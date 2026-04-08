"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useFinanceStore } from "@/features/finance/store";
import { useGoalsStore } from "@/features/goals/store";
import { useHabitsStore } from "@/features/habits/store";
import { useMoodStore } from "@/features/mood/store";
import {
  AnalyticsSummary,
  buildMonthlySummary,
  buildWeeklySummary,
} from "@/services/analytics";

type ReportsState = {
  weeklyArchive: AnalyticsSummary[];
  monthlyArchive: AnalyticsSummary[];
  activeMonthRef: string;
  archiveWeekly: (referenceDate?: string) => AnalyticsSummary;
  archiveMonthlyAndRoll: (referenceDate?: string) => AnalyticsSummary;
};

function isoMonth(date: Date) {
  return date.toISOString().slice(0, 7);
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      weeklyArchive: [],
      monthlyArchive: [],
      activeMonthRef: isoMonth(new Date()),
      archiveWeekly: (referenceDate) => {
        const base = referenceDate ? new Date(`${referenceDate}T00:00:00`) : new Date();
        const summary = buildWeeklySummary(
          base,
          useMoodStore.getState().entries,
          useFinanceStore.getState().entries,
          useHabitsStore.getState().habits,
          useGoalsStore.getState().goals,
        );
        set((state) => ({ weeklyArchive: [summary, ...state.weeklyArchive].slice(0, 52) }));
        return summary;
      },
      archiveMonthlyAndRoll: (referenceDate) => {
        const base = referenceDate ? new Date(`${referenceDate}T00:00:00`) : new Date();
        const summary = buildMonthlySummary(
          base,
          useMoodStore.getState().entries,
          useFinanceStore.getState().entries,
          useHabitsStore.getState().habits,
          useGoalsStore.getState().goals,
        );
        const nextMonth = new Date(base.getFullYear(), base.getMonth() + 1, 1);
        set((state) => ({
          monthlyArchive: [summary, ...state.monthlyArchive].slice(0, 24),
          activeMonthRef: isoMonth(nextMonth),
        }));
        return summary;
      },
    }),
    {
      name: "life-dashboard-reports",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
