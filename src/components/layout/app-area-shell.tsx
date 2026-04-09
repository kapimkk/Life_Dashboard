"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookMarked,
  ChevronLeft,
  Coins,
  Flag,
  Heart,
  Home,
  Menu,
  Search,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { useAuth } from "@/features/auth/auth-provider";
import { cn } from "@/lib/utils";

type AppAreaShellProps = {
  children: ReactNode;
};

const items = [
  { href: "/dashboard", label: "Dashboard", title: "Command Center", icon: Home },
  { href: "/habitos", label: "Habitos", title: "Habitos", icon: Sparkles },
  { href: "/financas", label: "Financas", title: "Financas", icon: WalletCards },
  { href: "/metas", label: "Metas", title: "Metas", icon: Flag },
  { href: "/investimentos", label: "Investimentos", title: "Investimentos", icon: Coins },
  { href: "/mood", label: "Mood", title: "Humor", icon: Heart },
  { href: "/vault", label: "Vault", title: "Vault", icon: BookMarked },
  { href: "/relatorios", label: "Relatorios", title: "Relatorios", icon: BarChart3 },
];

function getInitials(name?: string | null) {
  if (!name) return "LO";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppAreaShell({ children }: AppAreaShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDashboard = pathname === "/dashboard";
  const queryValue = searchParams.get("q") ?? "";

  const currentTitle = useMemo(
    () => items.find((item) => pathname.startsWith(item.href))?.title ?? "Command Center",
    [pathname],
  );

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-white/10 bg-zinc-950/95 p-3 transition-all duration-300 md:sticky md:top-0",
          collapsed ? "w-[84px]" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <Brand href="/dashboard" compact={collapsed} />
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden rounded-lg border border-white/10 bg-white/5 p-1 text-zinc-300 transition hover:bg-white/10 md:inline-flex"
          >
            <ChevronLeft size={16} className={cn("transition", collapsed && "rotate-180")} />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 text-zinc-300 md:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const selected = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                  selected
                    ? "bg-violet-600/90 text-white"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100",
                )}
              >
                <Icon size={16} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className={cn("flex min-w-0 flex-1 flex-col transition-all", collapsed ? "md:pl-2" : "md:pl-4")}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/75 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300 md:hidden"
            >
              <Menu size={16} />
            </button>
            <h1 className="text-lg font-semibold text-zinc-100">{currentTitle}</h1>
            <div className="ml-auto hidden items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-400 md:flex">
              <Search size={14} />
              {isDashboard ? (
                <input
                  value={queryValue}
                  onChange={(event) => {
                    const value = event.target.value;
                    const params = new URLSearchParams(searchParams.toString());
                    if (value.trim()) {
                      params.set("q", value);
                    } else {
                      params.delete("q");
                    }
                    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
                  }}
                  placeholder="Buscar habitos, metas e transacoes"
                  className="w-72 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
                />
              ) : (
                <span>Busca rapida</span>
              )}
            </div>
            <span className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-zinc-900 text-xs font-semibold text-zinc-100">
              {getInitials(user?.name)}
            </span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-w-0 flex-1"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
