"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type GoalCategory = "Curto Prazo" | "Médio Prazo" | "Longo Prazo";
export type GoalStatus = "todo" | "in_progress" | "done";
export type Goal = {
  id: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  status: GoalStatus;
};

type GoalsState = {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, goal: Omit<Goal, "id">) => void;
  updateGoalStatus: (id: string, status: GoalStatus) => void;
  deleteGoal: (id: string) => void;
};

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: crypto.randomUUID() }],
        })),
      updateGoal: (id, goal) =>
        set((state) => ({
          goals: state.goals.map((entry) =>
            entry.id === id ? { ...entry, ...goal } : entry,
          ),
        })),
      updateGoalStatus: (id, status) =>
        set((state) => ({
          goals: state.goals.map((entry) =>
            entry.id === id ? { ...entry, status } : entry,
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: "life-dashboard-goals",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function getGoalProgress(goal: Goal) {
  if (goal.targetValue <= 0) return 0;
  const value = (goal.currentValue / goal.targetValue) * 100;
  return Math.min(100, Math.max(0, value));
}
