"use client";

import type React from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

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
    <div className="min-h-screen w-full bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand / Hero Panel (hidden on mobile) */}
        <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary p-12 text-primary-foreground">
          {/* Decorative grid pattern */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Floating blobs */}
          <div
            aria-hidden
            className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/30 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-primary-foreground/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-primary-foreground/10 blur-2xl"
          />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-sm ring-1 ring-primary-foreground/20">
              <span className="text-2xl">🌳</span>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold tracking-tight">
                WoodLoop
              </h1>
              <p className="text-xs text-primary-foreground/70">
                Jepara Circular Hub
              </p>
            </div>
          </div>

          {/* Center quote */}
          <div className="relative z-10 space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Ekonomi Sirkular Kayu
            </div>
            <h2 className="text-4xl font-heading font-bold leading-[1.1] tracking-tight">
              Ubah limbah kayu menjadi{" "}
              <span className="text-accent">nilai berkelanjutan</span>.
            </h2>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Platform yang menghubungkan pemasok, pengrajin, pengepul, dan
              konsumen dalam satu ekosistem ekonomi sirkular untuk industri
              furnitur Jepara.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: "7", label: "Peran" },
                { value: "100%", label: "Lokal" },
                { value: "♻️", label: "Sirkular" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-3 backdrop-blur-sm"
                >
                  <div className="text-2xl font-heading font-bold text-accent">
                    {s.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer tagline */}
          <div className="relative z-10 text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} WoodLoop — Dari Jepara untuk dunia.
          </div>
        </aside>

        {/* Form Panel */}
        <main className="flex flex-col items-center justify-center p-6 sm:p-10">
          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-xl">🌳</span>
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-primary">
                WoodLoop
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Jepara Circular Hub
              </p>
            </div>
          </div>

          <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
