"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
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

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
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
    (o: RawTimberOrder) => o.status === "received"
  );
  const totalRevenue = completedOrders.reduce(
    (sum: number, o: RawTimberOrder) => sum + o.total_price,
    0
  );

  // Monthly aggregation for chart
  const monthlyData = useMemo(() => {
    const months: Record<
      string,
      { revenue: number; count: number }
    > = {};

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
        <h1 className="heading-2">Riwayat Penjualan</h1>
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat data penjualan
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Periksa koneksi ke server
          </p>
          <button
            className="text-sm text-primary underline"
            onClick={() => refetch()}
          >
            Coba Lagi
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Riwayat Penjualan</h1>
        <p className="text-muted-foreground mt-1">
          Pantau pendapatan dan riwayat transaksi Anda
        </p>
      </div>

      {/* Summary */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pendapatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pesanan Selesai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monthly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Penjualan per Bulan</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : monthlyData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Belum ada data penjualan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {monthlyData.map(([month, data]) => {
                const [year, m] = month.split("-");
                const monthName = new Date(
                  Number(year),
                  Number(m) - 1
                ).toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                });
                const maxRevenue = Math.max(
                  ...monthlyData.map(([, d]) => d.revenue),
                  1
                );
                const barWidth = (data.revenue / maxRevenue) * 100;

                return (
                  <div key={month} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{monthName}</span>
                      <span className="font-semibold">
                        {formatCurrency(data.revenue)}
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada transaksi</p>
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
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell
                          className={
                            isRevenue ? "text-success font-medium" : ""
                          }
                        >
                          {isRevenue ? "+" : ""}
                          {formatCurrency(order.total_price)}
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
