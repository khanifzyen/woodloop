"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const onboardingDone = localStorage.getItem("woodloop_onboarding_done");

    if (onboardingDone === "true") {
      router.replace("/login");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return null;
}
