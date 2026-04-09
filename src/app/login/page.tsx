"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/features/auth/auth-form";
import { useAuth } from "@/features/auth/auth-provider";

export default function LoginPage() {
  const { token, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && token) router.replace("/dashboard");
  }, [initialized, token, router]);

  return <AuthForm mode="login" />;
}
