import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm text-zinc-300">
      <span>{label}</span>
      <select
        className={cn(
          "rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-50 outline-none ring-violet-500 transition focus:ring-2",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
