"use client";

import Link from "next/link";
import {
  Package,
  ClipboardList,
  TrendingUp,
  Wallet,
  Plus,
  ArrowRight,
  Activity,
  Sparkles,
  TreePine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";
import { SummaryCards } from "@/components/features/summary-cards";
import {
  useSupplierDashboard,
} from "@/lib/hooks/use-supplier";

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

import { formatDate } from "@/lib/utils";

const activityStyle: Record<string, { icon: string; bg: string; color: string }> = {
  listing_created: { icon: "🪵", bg: "bg-amber-500/10", color: "text-amber-600" },
  order_received: { icon: "📦", bg: "bg-blue-500/10", color: "text-blue-600" },
  order_completed: { icon: "✅", bg: "bg-emerald-500/10", color: "text-emerald-600" },
  listing_sold: { icon: "💰", bg: "bg-green-500/10", color: "text-green-600" },
};

export default function SupplierDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useSupplierDashboard();
  const { user } = useAuthStore();

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-2">Dashboard Supplier</h1>
        </div>
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Activity className="h-6 w-6 text-destructive" />
          </div>
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

  const firstName = user?.name?.split(" ")[0] || "Supplier";

  return (
    <div className="space-y-6">
      {/* Hero / Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-primary/85 to-secondary p-6 sm:p-8 text-primary-foreground shadow-lg shadow-primary/10">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary-foreground/15 blur-2xl"
        />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm">
              <TreePine className="h-3 w-3" />
              Supplier Dashboard
            </div>
            <h1 className="text-2xl font-heading font-bold sm:text-3xl">
              Halo, {firstName}! 🌳
            </h1>
            <p className="text-sm text-primary-foreground/85 max-w-lg">
              Kelola inventaris kayu, pantau pesanan masuk, dan maksimalkan penjualan Anda di WoodLoop.
            </p>
          </div>
          <Button
            asChild
            className="h-11 w-fit bg-accent font-semibold text-accent-foreground shadow-lg shadow-accent/30 hover:bg-accent/90"
          >
            <Link href="/supplier/inventory/new">
              <Plus className="mr-2 h-4 w-4" />
              Daftarkan Kayu Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards items={summaryItems} loading={isLoading} />

      {/* Recent Activity + Quick Links */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity — takes 2 cols */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
            </div>
            {data && data.recentActivity.length > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/supplier/sales">
                  Lihat Semua
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-muted-foreground">
                  Belum ada aktivitas
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mulai dengan mendaftarkan kayu Anda!
                </p>
                <Button asChild className="mt-4" size="sm">
                  <Link href="/supplier/inventory/new">
                    <Plus className="mr-1 h-4 w-4" />
                    Daftarkan Kayu
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {data?.recentActivity.map((activity, idx) => {
                  const style = activityStyle[activity.type] || activityStyle.listing_created;
                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 ${idx !== data.recentActivity.length - 1
                        ? "border-b border-border/40"
                        : ""
                        }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${style.bg}`}
                      >
                        {style.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {activity.type === "listing_created" && "Kayu baru didaftarkan"}
                          {activity.type === "order_received" && "Pesanan baru masuk"}
                          {activity.type === "order_completed" && "Pesanan selesai"}
                          {activity.type === "listing_sold" && "Kayu terjual"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                      {activity.amount ? (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-success/30 bg-emerald-500/10 font-semibold text-emerald-700 dark:text-emerald-400"
                        >
                          +{formatCurrency(activity.amount)}
                        </Badge>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">Menu Cepat</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            <Button
              variant="outline"
              className="group h-auto w-full justify-between p-4 hover:border-primary/40 hover:bg-primary/5"
              asChild
            >
              <Link href="/supplier/inventory">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Inventaris</p>
                    <p className="text-xs text-muted-foreground">
                      Kelola stok kayu
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="group h-auto w-full justify-between p-4 hover:border-primary/40 hover:bg-primary/5"
              asChild
            >
              <Link href="/supplier/orders">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Pesanan</p>
                    <p className="text-xs text-muted-foreground">
                      {data?.pendingOrders
                        ? `${data.pendingOrders} perlu diproses`
                        : "Tidak ada pesanan"}
                    </p>
                  </div>
                </div>
                {data?.pendingOrders ? (
                  <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                    {data.pendingOrders}
                  </Badge>
                ) : (
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </Button>

            <Button
              variant="outline"
              className="group h-auto w-full justify-between p-4 hover:border-primary/40 hover:bg-primary/5"
              asChild
            >
              <Link href="/supplier/sales">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Penjualan</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(data?.totalRevenue ?? 0)}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
