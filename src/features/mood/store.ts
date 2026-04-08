"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MoodScore = 1 | 2 | 3 | 4 | 5;

export type MoodEntry = {
  id: string;
  date: string;
  moodScore: MoodScore;
  emoji: string;
  note: string;
};

type MoodState = {
  entries: MoodEntry[];
  upsertMood: (payload: Omit<MoodEntry, "id">) => void;
  deleteMood: (id: string) => void;
};

export const moodOptions: { score: MoodScore; emoji: string; label: string }[] = [
  { score: 5, emoji: "😁", label: "Excelente" },
  { score: 4, emoji: "🙂", label: "Bom" },
  { score: 3, emoji: "😐", label: "Neutro" },
  { score: 2, emoji: "🙁", label: "Ruim" },
  { score: 1, emoji: "😞", label: "Pessimo" },
];

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      entries: [],
      upsertMood: (payload) =>
        set((state) => {
          const existing = state.entries.find((entry) => entry.date === payload.date);
          if (existing) {
            return {
              entries: state.entries.map((entry) =>
                entry.id === existing.id ? { ...entry, ...payload } : entry,
              ),
            };
          }
          return {
            entries: [{ ...payload, id: crypto.randomUUID() }, ...state.entries],
          };
        }),
      deleteMood: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: "life-dashboard-mood",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
