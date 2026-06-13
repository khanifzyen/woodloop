"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

const ROLES = [
  {
    id: "supplier",
    label: "Supplier",
    desc: "Pedagang kayu — pemasok kayu log/kotak/papan/lainnya",
    icon: "🪵",
  },
  {
    id: "generator",
    label: "Generator",
    desc: "Pengrajin/Sawmill/UKM — penghasil limbah kayu",
    icon: "🏭",
  },
  {
    id: "aggregator",
    label: "Aggregator",
    desc: "Pengepul/Logistik — jemput dan sortir limbah",
    icon: "🚚",
  },
  {
    id: "converter",
    label: "Converter",
    desc: "UKM/Pengrajin limbah — ubah limbah jadi produk",
    icon: "🎨",
  },
  {
    id: "enabler",
    label: "Enabler",
    desc: "Pemerintah/Asosiasi — pantau dampak lingkungan",
    icon: "📊",
  },
  {
    id: "buyer",
    label: "Buyer",
    desc: "Konsumen akhir — beli produk daur ulang",
    icon: "🛍️",
  },
  {
    id: "designer",
    label: "Desainer",
    desc: "Konsultan desain — saran produk, artikel sirkular",
    icon: "✏️",
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
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-heading">Pilih Peran Anda</CardTitle>
        <CardDescription>
          Pilih peran yang sesuai dengan aktivitas Anda di ekosistem WoodLoop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelected(role.id)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 text-center
                transition-all duration-200 hover:shadow-md
                ${selected === role.id
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground/30"
                }
              `}
            >
              {selected === role.id && (
                <span className="absolute top-2 right-2 text-primary">
                  <Check className="h-4 w-4" />
                </span>
              )}
              <span className="text-3xl">{role.icon}</span>
              <span className="font-medium text-sm">{role.label}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">
                {role.desc}
              </span>
            </button>
          ))}
        </div>

        <Button
          className="w-full mt-6"
          disabled={!selected}
          onClick={handleConfirm}
        >
          Konfirmasi
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
