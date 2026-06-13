"use client";

import { useState } from "react";
import { useImpactMetrics, useExportImpactData } from "@/lib/hooks/use-enabler";
import { SummaryCards } from "@/components/features/summary-cards";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Wind, DollarSign, Download, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from "recharts";
import { toast } from "sonner";

export default function EnablerDashboardPage() {
  const [period, setPeriod] = useState("all");
  const { data, isLoading } = useImpactMetrics(period);
  const exportData = useExportImpactData();

  const items = [
    { title: "Limbah Terpakai", value: Math.round(data?.totalWasteDiverted ?? 0), icon: Recycle, prefix: "" },
    { title: "CO₂ Tersimpan", value: Math.round(data?.totalCO2Saved ?? 0), icon: Wind, prefix: "" },
    { title: "Nilai Ekonomi", value: Math.round(data?.totalEconomicValue ?? 0), icon: DollarSign, prefix: "Rp " },
    { title: "Total Pengguna", value: data?.totalUsers ?? 0, icon: Leaf },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="heading-2">Dashboard Enabler</h1>
          <p className="text-muted-foreground mt-1">Pantau dampak lingkungan dan kelola platform</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm">
            <option value="all">Semua Waktu</option>
            <option value="1m">1 Bulan</option>
            <option value="3m">3 Bulan</option>
            <option value="1y">1 Tahun</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              exportData.mutate(undefined, {
                onSuccess: () => toast.success("Data diunduh"),
                onError: () => toast.error("Gagal mengekspor data"),
              });
            }}
            disabled={exportData.isPending || isLoading}
          >
            {exportData.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <SummaryCards items={items} loading={isLoading} />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart: Limbah per Bulan */}
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-4">Limbah per Bulan (kg)</h3>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Memuat...</div>
          ) : data?.monthlyData && data.monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value) => [`${Number(value).toLocaleString("id-ID")} kg`, "Limbah"]}
                />
                <Bar dataKey="waste" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
          )}
        </div>

        {/* Line Chart: CO₂ Trend */}
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-4">Tren CO₂ Tersimpan (kg)</h3>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Memuat...</div>
          ) : data?.monthlyData && data.monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value) => [`${Number(value).toLocaleString("id-ID")} kg`, "CO₂"]}
                />
                <Line type="monotone" dataKey="co2" stroke="hsl(200, 80%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
          )}
        </div>

        {/* Area Chart: Nilai Ekonomi */}
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-4">Nilai Ekonomi per Bulan (Rp)</h3>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Memuat...</div>
          ) : data?.monthlyData && data.monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}rb`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Nilai Ekonomi"]}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(40, 90%, 50%)" fill="hsl(40, 90%, 50%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
          )}
        </div>

        {/* Role Distribution */}
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-4">Distribusi Peran</h3>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Memuat...</div>
          ) : data?.roleDistribution && data.roleDistribution.length > 0 ? (
            <div className="space-y-3">
              {data.roleDistribution.map((r) => {
                const maxCount = Math.max(...data.roleDistribution.map((d) => d.count), 1);
                return (
                  <div key={r.role} className="flex items-center gap-3">
                    <span className="text-sm w-24 capitalize">{r.role}</span>
                    <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${(r.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right font-medium">{r.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
          )}
        </div>
      </div>
    </div>
  );
}
