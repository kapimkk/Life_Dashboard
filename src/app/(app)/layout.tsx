"use client";

import { ReactNode } from "react";
import { AppAreaShell } from "@/components/layout/app-area-shell";
import { ProtectedRoute } from "@/components/layout/protected-route";

export default function AppAreaLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppAreaShell>{children}</AppAreaShell>
    </ProtectedRoute>
  );
}
