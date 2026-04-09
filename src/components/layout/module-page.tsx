import { ReactNode } from "react";

type ModulePageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function ModulePage({ title, description, children }: ModulePageProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-zinc-100">{title}</h1>
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
      </header>
      {children}
    </section>
  );
}
