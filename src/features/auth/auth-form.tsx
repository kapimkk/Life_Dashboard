"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        await register(name, email, password);
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
      <Card title={mode === "login" ? "Entrar" : "Criar conta"}>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {mode === "register" && (
            <Input
              label="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          )}
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
            {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </Button>
          <p className="text-sm text-zinc-400">
            {mode === "login" ? "Ainda não tem conta?" : "Já possui conta?"}{" "}
            <Link
              className="text-violet-400 hover:text-violet-300"
              href={mode === "login" ? "/register" : "/login"}
            >
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
