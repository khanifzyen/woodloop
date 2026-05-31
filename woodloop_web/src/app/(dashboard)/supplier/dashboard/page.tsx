"use client";

import Link from "next/link";
import {
  Package,
  ClipboardList,
  TrendingUp,
  Wallet,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCards } from "@/components/features/summary-cards";
import {
  useSupplierDashboard,
  type SupplierDashboardData,
} from "@/lib/hooks/use-supplier";

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function SupplierDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useSupplierDashboard();

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-2">Dashboard Supplier</h1>
        </div>
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat data dashboard
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || "Terjadi kesalahan koneksi ke server"}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  const summaryItems = [
    {
      title: "Listing Aktif",
      value: data?.activeListings ?? 0,
      icon: Package,
      trend: data?.activeListings ? undefined : undefined,
    },
    {
      title: "Order Pending",
      value: data?.pendingOrders ?? 0,
      icon: ClipboardList,
    },
    {
      title: "Total Penjualan",
      value: data?.totalRevenue ?? 0,
      icon: TrendingUp,
      prefix: "Rp ",
    },
    {
      title: "Saldo Dompet",
      value: data?.walletBalance ?? 0,
      icon: Wallet,
      prefix: "Rp ",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Dashboard Supplier</h1>
          <p className="text-muted-foreground mt-1">
            Kelola inventaris kayu, pantau pesanan, dan lihat penjualan Anda
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/supplier/inventory/new">
            <Plus className="h-4 w-4" />
            Daftarkan Kayu Baru
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <SummaryCards items={summaryItems} loading={isLoading} />

      {/* Recent Activity + Quick Links */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
            {data && data.recentActivity.length > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/supplier/sales">
                  Lihat Semua <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada aktivitas. Mulai dengan mendaftarkan kayu Anda!
              </p>
            ) : (
              <div className="space-y-4">
                {data?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {activity.type === "listing_created" ? "🪵" : "📦"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {activity.type === "listing_created" && "Kayu baru didaftarkan"}
                        {activity.type === "order_received" && "Pesanan baru masuk"}
                        {activity.type === "order_completed" && "Pesanan selesai"}
                        {activity.type === "listing_sold" && "Kayu terjual"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    {activity.amount ? (
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {formatCurrency(activity.amount)}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Menu Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              asChild
            >
              <Link href="/supplier/inventory">
                <Package className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Inventaris Kayu</p>
                  <p className="text-xs text-muted-foreground">
                    Lihat dan kelola stok kayu Anda
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              asChild
            >
              <Link href="/supplier/orders">
                <ClipboardList className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Pesanan Masuk</p>
                  <p className="text-xs text-muted-foreground">
                    {data?.pendingOrders
                      ? `${data.pendingOrders} pesanan perlu diproses`
                      : "Tidak ada pesanan baru"}
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              asChild
            >
              <Link href="/supplier/sales">
                <TrendingUp className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Riwayat Penjualan</p>
                  <p className="text-xs text-muted-foreground">
                    Total penjualan: {formatCurrency(data?.totalRevenue ?? 0)}
                  </p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
