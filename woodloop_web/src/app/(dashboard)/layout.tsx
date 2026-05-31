"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRealtimeNotifications } from "@/lib/hooks/use-wallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();

  // Activate real-time notification subscription globally
  useRealtimeNotifications(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !role) {
    return null;
  }

  return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
