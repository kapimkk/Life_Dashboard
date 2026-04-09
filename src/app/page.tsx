"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BadgeDollarSign, Link2, Rocket } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { useAuth } from "@/features/auth/auth-provider";

export default function LandingPage() {
  const { token, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && token) {
      router.replace("/dashboard");
    }
  }, [initialized, token, router]);

  if (!initialized) return null;
  if (token) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-10 md:pt-16">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/30 p-8 md:p-14"
      >
        <div className="pointer-events-none absolute -right-14 -top-16 size-52 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 size-60 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <Brand />
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
            <Rocket size={14} />
            Sistema de vida inteligente
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            LifeOS organiza sua rotina, dinheiro e evolucao em um unico fluxo
          </h1>
          <p className="mt-5 text-base text-zinc-300 md:text-lg">
            Pare de alternar entre planilhas, apps e blocos de notas. Com o LifeOS voce executa seu plano
            diario com clareza, acompanha resultados em tempo real e transforma progresso em habito.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-500"
            >
              Criar meu LifeOS
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Ja tenho conta
            </Link>
          </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="space-y-3"
          >
            <div className="rounded-2xl border border-white/10 bg-zinc-900/75 p-4">
              <p className="text-xs text-zinc-400">Painel diario</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">Sua ofensiva esta em 15 dias! 🔥</p>
              <div className="mt-3 flex gap-2">
                {["Leitura", "Treino", "Meditacao"].map((item) => (
                  <span key={item} className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/75 p-4">
              <p className="text-xs text-zinc-400">Credito inteligente</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">Parcelas sob controle nos proximos 3 meses</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-2/3 rounded-full bg-violet-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="mt-10 space-y-10">
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 md:grid-cols-2"
        >
          <div>
            <h3 className="text-2xl font-semibold text-zinc-100">Ofensiva de Habitos que realmente engaja</h3>
            <p className="mt-2 text-sm text-zinc-400">
              O LifeOS transforma consistencia em jogo: cada dia concluido aumenta sua ofensiva e destaca o que
              ainda esta pendente. Voce sabe exatamente o que precisa fazer agora para manter o ritmo.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs text-zinc-400">Sequencia atual</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">15 dias de ofensiva</p>
            <div className="mt-3 flex gap-2">
              {[true, true, true, true, false].map((done, index) => (
                <span
                  key={index}
                  className={`inline-flex rounded-lg px-2 py-1 text-xs ${done ? "bg-violet-500/20 text-violet-200" : "bg-zinc-800 text-zinc-500"}`}
                >
                  Dia {index + 1}
                </span>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 md:grid-cols-2"
        >
          <div className="order-2 md:order-1 rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-zinc-400">Credito inteligente</p>
              <BadgeDollarSign className="text-violet-300" size={16} />
            </div>
            <p className="text-lg font-semibold text-zinc-100">Fatura prevista: R$ 842,90</p>
            <p className="mt-1 text-xs text-zinc-400">3 parcelas em queda automatica</p>
            <div className="mt-3 space-y-2">
              {[72, 55, 38].map((value, idx) => (
                <div key={idx} className="h-2 rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" style={{ width: `${value}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-2xl font-semibold text-zinc-100">Credito inteligente para decidir com calma</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Em vez de descobrir atrasos no fim do mes, o LifeOS mostra antecipadamente seu impacto real de
              parcelamentos, faturas e saldo projetado. Voce assume o controle antes que a fatura assuma voce.
            </p>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 md:grid-cols-2"
        >
          <div>
            <h3 className="text-2xl font-semibold text-zinc-100">Caixinhas de investimento para sonhos reais</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Crie caixinhas para objetivos concretos - viagem, reserva, estudos - e acompanhe cada deposito como
              progresso visivel. O foco deixa de ser “investir algum dia” e vira “concluir minha proxima meta”.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs text-zinc-400">Caixinhas ativas</p>
            <div className="mt-3 space-y-3">
              {[
                { title: "Reserva de emergencia", progress: 64 },
                { title: "Viagem 2027", progress: 41 },
              ].map((item) => (
                <div key={item.title}>
                  <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
                    <span>{item.title}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 md:grid-cols-2"
        >
          <div className="order-2 md:order-1 rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs text-zinc-400">Vault de links</p>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
              {["Curso de IA aplicada", "Artigo sobre rotina", "Playlist foco profundo"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg bg-zinc-900 px-2 py-1">
                  <Link2 size={14} className="text-zinc-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-2xl font-semibold text-zinc-100">Vault de links: tudo salvo, nada perdido</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Ideias importantes nao desaparecem mais em abas abertas. Com o Vault, voce organiza cursos, videos,
              artigos e referencias em um repositorio simples, pronto para usar no momento certo.
            </p>
            <Link
              href="/register"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
            >
              Comecar agora
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.article>
      </section>

      <footer className="mt-10 flex items-center justify-between border-t border-white/10 pt-5">
        <Brand href="/" />
        <p className="text-xs text-zinc-500">LifeOS - seu sistema operacional pessoal</p>
      </footer>
    </div>
  );
}
