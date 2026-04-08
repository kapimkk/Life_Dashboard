"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type VaultCategory = "Livro" | "Curso" | "Artigo" | "Video" | "Outros";
export type VaultStatus = "Pendente" | "Concluido";

export type VaultItem = {
  id: string;
  title: string;
  url: string;
  category: VaultCategory;
  status: VaultStatus;
};

type VaultState = {
  items: VaultItem[];
  addItem: (payload: Omit<VaultItem, "id">) => void;
  updateItem: (id: string, payload: Omit<VaultItem, "id">) => void;
  deleteItem: (id: string) => void;
  toggleStatus: (id: string) => void;
};

export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (payload) =>
        set((state) => ({
          items: [{ id: crypto.randomUUID(), ...payload }, ...state.items],
        })),
      updateItem: (id, payload) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...payload } : item)),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      toggleStatus: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, status: item.status === "Pendente" ? "Concluido" : "Pendente" }
              : item,
          ),
        })),
    }),
    {
      name: "life-dashboard-vault",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
