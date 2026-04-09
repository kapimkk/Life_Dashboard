"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type OnboardingData = {
  organization: string;
  mainGoal: string;
  source: string;
  preferredName: string;
  email: string;
};

type OnboardingState = {
  data: OnboardingData;
  step: number;
  setStep: (value: number) => void;
  setField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  reset: () => void;
};

const initialData: OnboardingData = {
  organization: "",
  mainGoal: "",
  source: "",
  preferredName: "",
  email: "",
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      data: initialData,
      step: 0,
      setStep: (value) => set(() => ({ step: value })),
      setField: (field, value) =>
        set((state) => ({
          data: { ...state.data, [field]: value },
        })),
      reset: () =>
        set(() => ({
          data: initialData,
          step: 0,
        })),
    }),
    {
      name: "life-dashboard-onboarding",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
