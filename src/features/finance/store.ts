"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Entry = {
  id: string;
  type: "entrada" | "saida";
  description: string;
  category: string;
  paymentMethod: "debito" | "credito";
  totalAmount: number;
  installments: number;
  date: string;
};

export type InstallmentView = {
  id: string;
  entryId: string;
  type: "entrada" | "saida";
  description: string;
  category: string;
  paymentMethod: "debito" | "credito";
  totalAmount: number;
  installmentAmount: number;
  installmentNumber: number;
  installments: number;
  dueDate: string;
};

type FinanceState = {
  entries: Entry[];
  balance: number;
  addEntry: (entry: Omit<Entry, "id">) => void;
  updateEntry: (id: string, entry: Omit<Entry, "id">) => void;
  deleteEntry: (id: string) => void;
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      entries: [],
      balance: 0,
      addEntry: (entry) =>
        set((state) => {
          const nextEntries = [{ ...entry, id: crypto.randomUUID() }, ...state.entries];
          return { entries: nextEntries, balance: getCurrentBalance(nextEntries) };
        }),
      updateEntry: (id, entry) =>
        set((state) => {
          const nextEntries = state.entries.map((current) =>
            current.id === id ? { ...current, ...entry } : current,
          );
          return { entries: nextEntries, balance: getCurrentBalance(nextEntries) };
        }),
      deleteEntry: (id) =>
        set((state) => {
          const nextEntries = state.entries.filter((entry) => entry.id !== id);
          return { entries: nextEntries, balance: getCurrentBalance(nextEntries) };
        }),
    }),
    {
      name: "life-dashboard-finance",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

function addMonths(isoDate: string, months: number) {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

export function getInstallments(entries: Entry[]): InstallmentView[] {
  return entries.flatMap((entry) => {
    const count = Math.max(1, entry.paymentMethod === "credito" ? entry.installments : 1);
    const installmentAmount = entry.totalAmount / count;
    return Array.from({ length: count }).map((_, index) => ({
      id: `${entry.id}-${index + 1}`,
      entryId: entry.id,
      type: entry.type,
      description: entry.description,
      category: entry.category,
      paymentMethod: entry.paymentMethod,
      totalAmount: entry.totalAmount,
      installmentAmount,
      installmentNumber: index + 1,
      installments: count,
      dueDate: addMonths(entry.date, index),
    }));
  });
}

export function getCurrentBalance(entries: Entry[]) {
  return getInstallments(entries).reduce((acc, item) => {
    return item.type === "entrada" ? acc + item.installmentAmount : acc - item.installmentAmount;
  }, 0);
}
