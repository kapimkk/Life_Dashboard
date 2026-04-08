import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm text-zinc-300">
      <span>{label}</span>
      <input
        className={cn(
          "rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-50 outline-none ring-violet-500 transition focus:ring-2",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </label>
  );
}
