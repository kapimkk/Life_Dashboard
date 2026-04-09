"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Brand } from "@/components/layout/brand";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/features/auth/onboarding-store";
import { useAuth } from "./auth-provider";

type AuthFormProps = {
  mode: "login" | "register";
};

const onboardingSteps = [
  {
    id: "organization",
    title: "Como voce avalia sua organizacao hoje?",
    options: ["Caotica", "Preciso de ajuda", "Moderada", "Ninja da Organizacao"],
  },
  {
    id: "mainGoal",
    title: "Qual seu principal objetivo aqui?",
    options: [
      "Economizar dinheiro",
      "Criar habitos saudaveis",
      "Gerenciar investimentos",
      "Tudo ao mesmo tempo",
    ],
  },
  {
    id: "source",
    title: "Como voce nos conheceu?",
    options: ["Recomendacao", "Redes Sociais", "Google", "Curiosidade"],
  },
] as const;

export function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const { data, step, setStep, setField, reset } = useOnboardingStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"account" | "questions" | "personalization" | "loading">("account");

  const isRegister = mode === "register";
  const currentStep = onboardingSteps[step];
  const progress = useMemo(() => {
    if (!isRegister) return 0;
    const total = onboardingSteps.length + 2;
    const current =
      phase === "loading" ? total : phase === "personalization" ? onboardingSteps.length + 1 : step + 1;
    return (current / total) * 100;
  }, [isRegister, phase, step]);

  useEffect(() => {
    if (mode === "register") {
      setEmail(data.email || "");
      setStep(0);
      setPhase("account");
    }
  }, [data.email, mode, setStep]);

  function selectOption(value: string) {
    if (!currentStep) return;
    setField(currentStep.id, value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        setPhase("loading");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        await register({
          name: data.preferredName,
          email,
          password,
          onboarding: {
            organization: data.organization,
            mainGoal: data.mainGoal,
            source: data.source,
          },
        });
        reset();
      } else {
        await login(email, password);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 w-full max-w-md px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card title={mode === "login" ? "Entrar" : "Criar conta"}>
          <div className="mb-4">
            <Brand href="/" />
          </div>
          {isRegister ? (
            <div>
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                  <span>Jornada personalizada</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <AnimatePresence mode="wait">
                {phase === "account" ? (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -26 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <p className="text-sm font-semibold text-zinc-100">Crie sua conta para iniciar</p>
                    <Input
                      label="E-mail"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setField("email", event.target.value);
                      }}
                      required
                    />
                    <Input
                      label="Senha"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                    {error ? <p className="text-sm text-red-400">{error}</p> : null}
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        if (!email.trim() || !password.trim()) {
                          setError("Preencha e-mail e senha para continuar.");
                          return;
                        }
                        setError("");
                        setPhase("questions");
                      }}
                    >
                      Continuar
                    </Button>
                  </motion.div>
                ) : null}

                {phase === "questions" && step < onboardingSteps.length ? (
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -26 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="mb-1 text-xs text-zinc-500">Passo {step + 2} de 5</p>
                    <p className="mb-4 text-sm font-semibold text-zinc-100">{currentStep.title}</p>
                    <div className="space-y-2">
                      {currentStep.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => selectOption(option)}
                          className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                            data[currentStep.id] === option
                              ? "border-violet-500 bg-violet-500/15 text-violet-100"
                              : "border-white/10 bg-zinc-900 text-zinc-300 hover:-translate-y-0.5 hover:border-violet-500/60 hover:bg-zinc-800"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          if (step === 0) {
                            setPhase("account");
                            return;
                          }
                          setStep(step - 1);
                        }}
                      >
                        Voltar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          if (step === onboardingSteps.length - 1) {
                            setPhase("personalization");
                            return;
                          }
                          setStep(step + 1);
                        }}
                        disabled={!data[currentStep.id]}
                      >
                        Continuar
                      </Button>
                    </div>
                  </motion.div>
                ) : null}

                {phase === "personalization" ? (
                  <motion.form
                    key="personalization"
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -26 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                    onSubmit={handleSubmit}
                  >
                    <p className="text-sm font-semibold text-zinc-100">Como gostaria de ser chamado?</p>
                    <Input
                      label="Nome"
                      value={data.preferredName}
                      onChange={(event) => setField("preferredName", event.target.value)}
                      required
                    />
                    <Input
                      label="E-mail"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setField("email", event.target.value);
                      }}
                      required
                    />
                    <Input
                      label="Senha"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                    {error ? <p className="text-sm text-red-400">{error}</p> : null}
                    <div className="flex items-center justify-between gap-2">
                      <Button type="button" variant="ghost" onClick={() => setPhase("questions")}>
                        Voltar
                      </Button>
                      <Button type="submit" disabled={loading || !data.preferredName.trim()}>
                        Concluir
                      </Button>
                    </div>
                  </motion.form>
                ) : null}

                {phase === "loading" ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -26 }}
                    className="rounded-xl border border-white/10 bg-zinc-900/70 p-5 text-center"
                  >
                    <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                    <p className="text-sm font-semibold text-zinc-100">Carregando seu ecossistema personalizado...</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              <Input
                label="E-mail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Finalizar cadastro"}
              </Button>
              {isRegister ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep(onboardingSteps.length - 1)}
                >
                  Revisar perguntas
                </Button>
              ) : null}
              <p className="text-sm text-zinc-400">
                {mode === "login" ? "Ainda nao tem conta?" : "Ja possui conta?"}{" "}
                <Link
                  className="text-violet-400 hover:text-violet-300"
                  href={mode === "login" ? "/register" : "/login"}
                >
                  {mode === "login" ? "Cadastre-se" : "Entrar"}
                </Link>
              </p>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
