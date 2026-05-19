"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, role, _hydrated } = useAuthStore();

  useEffect(() => {
    // Tunggu Zustand selesai restore dari localStorage
    if (!_hydrated) return;

    // Priority 1: User sudah login → langsung ke dashboard
    if (isAuthenticated && role) {
      router.replace(`/${role}/dashboard`);
      return;
    }

    // Priority 2: Belum pernah onboarding → ke onboarding
    const onboardingDone = localStorage.getItem("woodloop_onboarding_done");
    if (onboardingDone !== "true") {
      router.replace("/onboarding");
      return;
    }

    // Priority 3: Udah onboarding tapi belum login → ke login
    router.replace("/login");
  }, [_hydrated, isAuthenticated, role, router]);

  return null;
}
