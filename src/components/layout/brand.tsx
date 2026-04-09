"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandProps = {
  href?: string;
  className?: string;
  compact?: boolean;
};

export function Brand({ href = "/", className, compact = false }: BrandProps) {
  const content = (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
        <Zap size={16} />
      </span>
      {!compact && <span className="text-sm font-semibold tracking-wide text-zinc-100">LifeOS</span>}
    </span>
  );

  return <Link href={href}>{content}</Link>;
}
