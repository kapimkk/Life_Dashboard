import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({ title, action, children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm",
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between">
          {title ? <h3 className="text-base font-semibold">{title}</h3> : <div />}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
