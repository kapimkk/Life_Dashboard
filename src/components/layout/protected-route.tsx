"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-provider";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !token) {
      router.replace("/login");
    }
  }, [initialized, token, router]);

  if (!initialized || !token) {
    return null;
  }

  return <>{children}</>;
}
