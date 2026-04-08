"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calculateStreak, toISODate } from "./utils/streak";

export type HabitFrequency = "diario" | "semanal";

export type Habit = {
  id: string;
  title: string;
  frequency: HabitFrequency;
  doneDates: string[];
};

type HabitState = {
  habits: Habit[];
  addHabit: (payload: { title: string; frequency: HabitFrequency }) => void;
  updateHabit: (id: string, payload: { title: string; frequency: HabitFrequency }) => void;
  deleteHabit: (id: string) => void;
  toggleHabitToday: (id: string) => void;
};

export const useHabitsStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      addHabit: ({ title, frequency }) =>
        set((state) => ({
          habits: [
            ...state.habits,
            { id: crypto.randomUUID(), title, frequency, doneDates: [] },
          ],
        })),
      updateHabit: (id, payload) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...payload } : habit,
          ),
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),
      toggleHabitToday: (id) =>
        set((state) => {
          const today = toISODate(new Date());
          return {
            habits: state.habits.map((habit) => {
              if (habit.id !== id) return habit;
              const alreadyDone = habit.doneDates.includes(today);
              return {
                ...habit,
                doneDates: alreadyDone
                  ? habit.doneDates.filter((date) => date !== today)
                  : [...habit.doneDates, today],
              };
            }),
          };
        }),
    }),
    {
      name: "life-dashboard-habits",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function getHabitStreak(habit: Habit) {
  return calculateStreak(habit.doneDates);
}
