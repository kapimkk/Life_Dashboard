"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { getGoalProgress, useGoalsStore } from "@/features/goals/store";
import { useHabitsStore } from "@/features/habits/store";
import { useFinanceStore } from "@/features/finance/store";
import { useInvestmentsStore } from "@/features/investments/store";

export function DashboardPanel() {
  const habits = useHabitsStore((state) => state.habits);
  const goals = useGoalsStore((state) => state.goals);
  const balance = useFinanceStore((state) => state.balance);
  const boxes = useInvestmentsStore((state) => state.boxes);

  const data = [
    { name: "Hábitos", value: habits.reduce((acc, habit) => acc + habit.doneDates.length, 0) },
    {
      name: "Metas",
      value:
        goals.length > 0
          ? goals.reduce((acc, goal) => acc + getGoalProgress(goal), 0) / goals.length
          : 0,
    },
    { name: "Saldo", value: Math.max(balance, 0) },
    { name: "Caixinhas", value: boxes.length },
  ];

  return (
    <Card title="Visão Geral">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip
              contentStyle={{
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: "12px",
              }}
            />
            <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
