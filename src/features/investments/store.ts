"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Asset = {
  id: string;
  name: string;
  currentValue: number;
  targetValue?: number;
};

type InvestmentState = {
  boxes: Asset[];
  addBox: (asset: Omit<Asset, "id">) => void;
  updateBox: (id: string, asset: Omit<Asset, "id">) => void;
  applyMovement: (id: string, type: "deposit" | "withdraw", amount: number) => void;
  deleteBox: (id: string) => void;
};

export const useInvestmentsStore = create<InvestmentState>()(
  persist(
    (set) => ({
      boxes: [],
      addBox: (asset) =>
        set((state) => ({
          boxes: [
            ...state.boxes,
            {
              id: crypto.randomUUID(),
              ...asset,
            },
          ],
        })),
      updateBox: (id, asset) =>
        set((state) => ({
          boxes: state.boxes.map((entry) =>
            entry.id === id
              ? { ...entry, ...asset }
              : entry,
          ),
        })),
      applyMovement: (id, type, amount) =>
        set((state) => ({
          boxes: state.boxes.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  currentValue:
                    type === "deposit"
                      ? entry.currentValue + amount
                      : Math.max(0, entry.currentValue - amount),
                }
              : entry,
          ),
        })),
      deleteBox: (id) =>
        set((state) => ({
          boxes: state.boxes.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: "life-dashboard-investments",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function getAssetPerformance(asset: Asset) {
  const target = asset.targetValue ?? 0;
  return {
    totalValue: asset.currentValue,
    progress: target > 0 ? Math.min(100, (asset.currentValue / target) * 100) : 0,
    remaining: target > 0 ? Math.max(0, target - asset.currentValue) : 0,
  };
}
