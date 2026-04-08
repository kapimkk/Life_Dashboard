"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" && "bg-violet-600 text-white hover:bg-violet-500",
        variant === "secondary" &&
          "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700",
        variant === "ghost" && "bg-transparent text-zinc-200 hover:bg-zinc-800",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-400",
        className,
      )}
      {...props}
    />
  );
}
