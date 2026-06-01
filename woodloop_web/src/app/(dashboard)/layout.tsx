"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRealtimeNotifications } from "@/lib/hooks/use-wallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, _hydrated, user } = useAuthStore();
  const router = useRouter();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  // Activate real-time notification subscription globally
  useRealtimeNotifications(true);

  useEffect(() => {
    if (!_hydrated) return;
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
    // Verify route matches user role
    const routeRole = pathname.split("/")[1];
    if (routeRole && routeRole !== user.role && !["changelog", "chat", "notifications", "wallet"].includes(routeRole)) {
      router.push(`/${user.role}/dashboard`);
    }
  }, [_hydrated, isAuthenticated, user, router, pathname]);

  if (!_hydrated || !isAuthenticated || !role) {
    return null;
  }

  return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
