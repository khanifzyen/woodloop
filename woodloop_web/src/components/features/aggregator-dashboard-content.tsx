"use client";

import { useAggregatorDashboard } from "@/lib/hooks/use-aggregator";
import { SummaryCards } from "@/components/features/summary-cards";
import { TruckIcon, WarehouseIcon, GavelIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AggregatorDashboardContent() {
  const { data, isLoading, error } = useAggregatorDashboard();

  const summaryItems = [
    { title: "Penjemputan Hari Ini", value: data?.pickupsToday ?? 0, icon: TruckIcon },
    { title: "Stok Gudang", value: data?.warehouseStock ?? 0, icon: WarehouseIcon },
    { title: "Bid Aktif", value: data?.activeBids ?? 0, icon: GavelIcon },
    { title: "Pendapatan", value: data?.revenue ?? 0, icon: DollarSignIcon, prefix: "Rp " },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Dashboard Aggregator</h1>
          <p className="text-muted-foreground mt-1">
            Temukan limbah di peta, atur penjemputan, kelola gudang, dan ikuti lelang.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/aggregator/treasure-map">
            🗺️ Lihat Peta Harta Karun
          </Link>
        </Button>
      </div>

      <SummaryCards items={summaryItems} loading={isLoading} />

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">Gagal memuat data dashboard.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Penjemputan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : data?.recentPickups?.length ? (
            <div className="space-y-3">
              {data.recentPickups.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <TruckIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Pickup #{p.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.status} — {new Date(p.created).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Belum ada penjemputan. Mulai dengan melihat peta!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
