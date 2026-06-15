"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Users, ChevronRight } from "lucide-react";

const ROLES = [
  {
    id: "supplier",
    label: "Supplier",
    desc: "Pedagang kayu — pemasok kayu log/kotak/papan/lainnya",
    icon: "🪵",
    color: "from-amber-500/20 to-yellow-500/20",
  },
  {
    id: "generator",
    label: "Generator",
    desc: "Pengrajin/Sawmill/UKM — penghasil limbah kayu",
    icon: "🏭",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "aggregator",
    label: "Aggregator",
    desc: "Pengepul/Logistik — jemput dan sortir limbah",
    icon: "🚚",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "converter",
    label: "Converter",
    desc: "UKM/Pengrajin limbah — ubah limbah jadi produk",
    icon: "🎨",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "enabler",
    label: "Enabler",
    desc: "Pemerintah/Asosiasi — pantau dampak lingkungan",
    icon: "📊",
    color: "from-sky-500/20 to-blue-500/20",
  },
  {
    id: "buyer",
    label: "Buyer",
    desc: "Konsumen akhir — beli produk daur ulang",
    icon: "🛍️",
    color: "from-emerald-500/20 to-green-500/20",
  },
  {
    id: "designer",
    label: "Desainer",
    desc: "Konsultan desain — saran produk, artikel sirkular",
    icon: "✏️",
    color: "from-rose-500/20 to-pink-500/20",
  },
] as const;

export default function RoleSelectionPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  function handleConfirm() {
    if (selected) {
      router.push(`/register?role=${selected}`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25">
          <Users className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-heading font-bold tracking-tight">
          Pilih Peran Anda
        </h1>
        <p className="text-sm text-muted-foreground">
          Pilih peran yang sesuai dengan aktivitas Anda di WoodLoop
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <div className="grid grid-cols-2 gap-2.5">
          {ROLES.map((role) => {
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelected(role.id)}
                className={`
                  group relative flex flex-col items-start gap-2 rounded-xl border-2 p-3.5 text-left
                  transition-all duration-200 overflow-hidden
                  ${
                    isSelected
                      ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-md ring-1 ring-primary/20"
                      : "border-border/60 hover:border-primary/40 hover:shadow-sm hover:bg-muted/30"
                  }
                `}
              >
                {/* Subtle gradient bg */}
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${role.color} ${
                    isSelected ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                  } transition-opacity`}
                />

                <div className="relative z-10 flex w-full items-start justify-between">
                  <span className="text-3xl drop-shadow-sm">{role.icon}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground scale-100"
                        : "bg-transparent border-2 border-border/60 scale-90"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </span>
                </div>

                <div className="relative z-10 space-y-0.5">
                  <span className="block text-sm font-semibold text-foreground">
                    {role.label}
                  </span>
                  <span className="block text-[11px] text-muted-foreground leading-snug">
                    {role.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirm bar */}
        <div className="mt-5 space-y-3">
          <Button
            className="h-11 w-full bg-gradient-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20 transition-all disabled:shadow-none disabled:opacity-50"
            disabled={!selected}
            onClick={handleConfirm}
          >
            Lanjut dengan{" "}
            {selected
              ? ROLES.find((r) => r.id === selected)?.label
              : "Peran"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="inline-flex items-center font-medium text-primary hover:underline"
            >
              Masuk
              <ChevronRight className="h-3 w-3" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
