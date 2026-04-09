"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { useAuth } from "@/features/auth/auth-provider";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function GlobalNavbar() {
  const { user, token, logout, initialized } = useAuth();
  const pathname = usePathname();
  const isLogged = initialized && Boolean(token);
  const isAppRoute = /^\/(dashboard|habitos|financas|metas|investimentos|mood|vault|relatorios|habits|finance|goals|investments|reports)(\/|$)/.test(
    pathname,
  );

  if (isAppRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/65 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Brand href={isLogged ? "/dashboard" : "/"} />

        {isLogged && user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-zinc-300 sm:inline">{user.name}</span>
            <span className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-zinc-900 text-xs font-semibold text-zinc-100">
              {getInitials(user.name)}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
              type="button"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800",
              )}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Cadastrar-se
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
