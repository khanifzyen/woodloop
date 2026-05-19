"use client";

import type React from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role, _hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hydrated) return;
    if (isAuthenticated && role) {
      router.push(`/${role}/dashboard`);
    }
  }, [isAuthenticated, role, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="text-3xl">🌳</span>
            <h1 className="text-2xl font-heading font-bold text-primary">
              WoodLoop
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Jepara Circular Hub
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
