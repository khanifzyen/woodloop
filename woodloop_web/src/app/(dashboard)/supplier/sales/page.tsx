"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  Receipt,
  BarChart3,
  XCircle,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupplierOrders } from "@/lib/hooks/use-supplier";
import type { RawTimberOrder } from "@/lib/pocketbase/types";

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

import { formatDate } from "@/lib/utils";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  received: { label: "Selesai", variant: "default" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
  shipped: { label: "Dikirim", variant: "secondary" },
  paid: { label: "Dibayar", variant: "default" },
  processing: { label: "Diproses", variant: "outline" },
  payment_pending: { label: "Menunggu Bayar", variant: "outline" },
};

export default function SupplierSalesPage() {
  const { data, isLoading, isError, refetch } = useSupplierOrders();
  const orders = data?.items ?? [];

  const completedOrders = orders.filter(
    (o: RawTimberOrder) => o.status === "received",
  );
  const totalRevenue = completedOrders.reduce(
    (sum: number, o: RawTimberOrder) => sum + o.total_price,
    0,
  );

  // Monthly aggregation for chart
  const monthlyData = useMemo(() => {
    const months: Record<string, { revenue: number; count: number }> = {};

    completedOrders.forEach((o: RawTimberOrder) => {
      const d = new Date(o.updated);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = { revenue: 0, count: 0 };
      months[key].revenue += o.total_price;
      months[key].count += 1;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6); // last 6 months
  }, [completedOrders]);

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <BarChart3 className="h-3.5 w-3.5" />
            Analitik Penjualan
          </div>
          <h1 className="heading-2">Riwayat Penjualan</h1>
        </div>
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium mb-2">
            Gagal memuat data penjualan
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Periksa koneksi ke server
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <BarChart3 className="h-3.5 w-3.5" />
          Analitik Penjualan
        </div>
        <h1 className="heading-2">Riwayat Penjualan</h1>
        <p className="text-sm text-muted-foreground">
          Pantau pendapatan dan riwayat transaksi Anda
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl"
          />
          <CardContent className="relative pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Pendapatan
                </p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-8 w-32" />
                ) : (
                  <p className="mt-1.5 text-2xl font-bold text-emerald-600">
                    {formatCurrency(totalRevenue)}
                  </p>
                )}
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl"
          />
          <CardContent className="relative pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Pesanan Selesai
                </p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-8 w-16" />
                ) : (
                  <p className="mt-1.5 text-2xl font-bold">
                    {completedOrders.length}
                  </p>
                )}
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
          />
          <CardContent className="relative pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Transaksi
                </p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-8 w-16" />
                ) : (
                  <p className="mt-1.5 text-2xl font-bold">{orders.length}</p>
                )}
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg">Penjualan per Bulan</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : monthlyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <TrendingUp className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium text-muted-foreground">
                Belum ada data penjualan
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Selesaikan pesanan untuk melihat grafik
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyData.map(([month, data]) => {
                const [year, m] = month.split("-");
                const monthName = new Date(
                  Number(year),
                  Number(m) - 1,
                ).toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                });
                const maxRevenue = Math.max(
                  ...monthlyData.map(([, d]) => d.revenue),
                  1,
                );
                const barWidth = (data.revenue / maxRevenue) * 100;

                return (
                  <div key={month} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{monthName}</span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(data.revenue)}
                      </span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {data.count} pesanan
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Receipt className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg">Daftar Transaksi</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
                <Receipt className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold">
                Belum ada transaksi
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Transaksi akan muncul setelah ada pesanan selesai
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: RawTimberOrder) => {
                    const st = statusConfig[order.status] || {
                      label: order.status,
                      variant: "outline" as const,
                    };
                    const isRevenue = order.status === "received";
                    return (
                      <TableRow
                        key={order.id}
                        className="hover:bg-muted/40"
                      >
                        <TableCell className="font-mono text-sm">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              isRevenue
                                ? "font-semibold text-emerald-600"
                                : "font-medium"
                            }
                          >
                            {isRevenue ? "+" : ""}
                            {formatCurrency(order.total_price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(order.created)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
