"use client";

import { useState } from "react";
import { useImpactMetrics } from "@/lib/hooks/use-enabler";
import { SummaryCards } from "@/components/features/summary-cards";
import { Leaf, Recycle, Wind, DollarSign } from "lucide-react";

export default function EnablerDashboardPage() {
  const [period, setPeriod] = useState("all");
  const { data, isLoading } = useImpactMetrics(period);

  const items = [
    { title: "Limbah Terpakai", value: Math.round(data?.totalWasteDiverted ?? 0), icon: Recycle, prefix: "" },
    { title: "CO₂ Tersimpan", value: Math.round(data?.totalCO2Saved ?? 0), icon: Wind, prefix: "" },
    { title: "Nilai Ekonomi", value: Math.round(data?.totalEconomicValue ?? 0), icon: DollarSign, prefix: "Rp " },
    { title: "Total Pengguna", value: data?.totalUsers ?? 0, icon: Leaf },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Dashboard Enabler</h1>
          <p className="text-muted-foreground mt-1">Pantau dampak lingkungan dan kelola platform</p>
        </div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm">
          <option value="all">Semua Waktu</option>
          <option value="1m">1 Bulan</option>
          <option value="3m">3 Bulan</option>
          <option value="1y">1 Tahun</option>
        </select>
      </div>

      <SummaryCards items={items} loading={isLoading} />

      {/* Monthly Chart (simple bar) */}
      {data?.monthlyData && data.monthlyData.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Limbah per Bulan (kg)</h3>
          <div className="flex items-end gap-2 h-40">
            {data.monthlyData.map((m) => {
              const maxWaste = Math.max(...data.monthlyData.map((d) => d.waste), 1);
              const h = Math.max((m.waste / maxWaste) * 100, 2);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{m.waste}</span>
                  <div className="w-full bg-primary/20 rounded-t" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-muted-foreground rotate-45 origin-left">{m.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Role Distribution */}
      {data?.roleDistribution && data.roleDistribution.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Distribusi Peran</h3>
          <div className="space-y-2">
            {data.roleDistribution.map((r) => (
              <div key={r.role} className="flex items-center gap-3">
                <span className="text-sm w-24 capitalize">{r.role}</span>
                <div className="flex-1 bg-muted rounded-full h-4">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(r.count / Math.max(...data.roleDistribution.map((d) => d.count), 1)) * 100}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
