"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/features/auth/auth-provider";
import { DashboardPanel } from "@/features/dashboard/dashboard-panel";
import { HabitsPanel } from "@/features/habits/habits-panel";
import { GoalsPanel } from "@/features/goals/goals-panel";
import { FinancePanel } from "@/features/finance/finance-panel";
import { InvestmentsPanel } from "@/features/investments/investments-panel";
import { MoodPanel } from "@/features/mood/mood-panel";
import { ReportsPanel } from "@/features/reports/reports-panel";
import { VaultPanel } from "@/features/vault/vault-panel";

const panelMap = {
  dashboard: <DashboardPanel />,
  habits: <HabitsPanel />,
  goals: <GoalsPanel />,
  finance: <FinancePanel />,
  investments: <InvestmentsPanel />,
  mood: <MoodPanel />,
  reports: <ReportsPanel />,
  vault: <VaultPanel />,
};

type PanelKey = keyof typeof panelMap;

export default function Home() {
  const [active, setActive] = useState<PanelKey>("dashboard");
  const { token, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !token) {
      router.replace("/login");
    }
  }, [initialized, token, router]);

  if (!initialized) return null;
  if (!token) return null;

  return (
    <AppShell active={active} onActiveChange={(value) => setActive(value as PanelKey)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {panelMap[active]}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
