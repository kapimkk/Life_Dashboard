"use client";

import { BarChart3, BookMarked, Coins, Flag, Heart, Home, LogOut, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  active: string;
  onActiveChange: (value: string) => void;
  children: ReactNode;
};

const items = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "habits", label: "Hábitos", icon: Sparkles },
  { id: "goals", label: "Metas", icon: Flag },
  { id: "finance", label: "Finanças", icon: BarChart3 },
  { id: "investments", label: "Investimentos", icon: Coins },
  { id: "mood", label: "Humor", icon: Heart },
  { id: "reports", label: "Relatorios", icon: BarChart3 },
  { id: "vault", label: "Vault", icon: BookMarked },
];

export function AppShell({ active, onActiveChange, children }: AppShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-4 md:flex-row">
      <aside className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 md:w-72">
        <h1 className="mb-1 text-lg font-bold text-violet-400">Life Dashboard</h1>
        <p className="mb-4 text-sm text-zinc-400">{user?.name}</p>
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                  selected ? "bg-violet-600 text-white" : "text-zinc-300 hover:bg-zinc-800"
                }`}
                onClick={() => onActiveChange(item.id)}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <Button
          className="mt-4 w-full"
          variant="ghost"
          onClick={logout}
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
