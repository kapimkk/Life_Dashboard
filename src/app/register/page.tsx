"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/features/auth/auth-form";
import { useAuth } from "@/features/auth/auth-provider";

export default function RegisterPage() {
  const { token, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && token) router.replace("/");
  }, [initialized, token, router]);

  return <AuthForm mode="register" />;
}
