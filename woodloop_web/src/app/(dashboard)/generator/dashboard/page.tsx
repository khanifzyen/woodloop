"use client";

import Link from "next/link";
import {
  Wallet,
  Trash2,
  Package,
  ShoppingCart,
  Plus,
  ArrowRight,
  MessageCircle,
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
import { SummaryCards } from "@/components/features/summary-cards";
import {
  useGeneratorDashboard,
  type GeneratorDashboardData,
} from "@/lib/hooks/use-generator";

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

export default function GeneratorDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useGeneratorDashboard();

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="heading-2">Dashboard Generator</h1>
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
      title: "Saldo Dompet",
      value: data?.walletBalance ?? 0,
      icon: Wallet,
      prefix: "Rp ",
    },
    {
      title: "Limbah Disetor",
      value: data ? `${data.totalWasteReported} kg` : "0 kg",
      icon: Trash2,
    },
    {
      title: "Produk Aktif",
      value: data?.activeProducts ?? 0,
      icon: Package,
    },
    {
      title: "Tawaran Masuk",
      value: data?.pendingBids ?? 0,
      icon: MessageCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Dashboard Generator</h1>
          <p className="text-muted-foreground mt-1">
            Setor limbah kayu, beli bahan baku, dan kelola produk Anda
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/generator/buy-timber">
              <ShoppingCart className="h-4 w-4" />
              Beli Kayu
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/generator/report-waste">
              <Plus className="h-4 w-4" />
              Setor Limbah
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards items={summaryItems} loading={isLoading} />

      {/* Recent Activity + Quick Links */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
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
                Belum ada aktivitas. Mulai dengan menyetor limbah!
              </p>
            ) : (
              <div className="space-y-4">
                {data?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {activity.type === "waste_reported" && "♻️"}
                      {activity.type === "timber_ordered" && "🛒"}
                      {activity.type === "product_created" && "🪑"}
                      {activity.type === "bid_received" && "📩"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {activity.type === "waste_reported" &&
                          "Limbah disetor"}
                        {activity.type === "timber_ordered" &&
                          "Pesanan kayu"}
                        {activity.type === "product_created" &&
                          "Produk baru"}
                        {activity.type === "bid_received" &&
                          "Tawaran dari Aggregator"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    {activity.amount ? (
                      <Badge variant="secondary" className="shrink-0">
                        {formatCurrency(activity.amount)}
                      </Badge>
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
              <Link href="/generator/report-waste">
                <Trash2 className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Setor Limbah</p>
                  <p className="text-xs text-muted-foreground">
                    Foto dan jual limbah kayu Anda
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              asChild
            >
              <Link href="/generator/buy-timber">
                <ShoppingCart className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Beli Kayu</p>
                  <p className="text-xs text-muted-foreground">
                    Cari kayu dari Supplier
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              asChild
            >
              <Link href="/generator/products">
                <Package className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Produk Saya</p>
                  <p className="text-xs text-muted-foreground">
                    Kelola produk furniture
                  </p>
                </div>
              </Link>
            </Button>
            {data && data.pendingBids > 0 && (
              <Card className="bg-warning/10 border-warning/20">
                <CardContent className="p-3 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-warning" />
                  <p className="text-sm">
                    {data.pendingBids} tawaran baru dari Aggregator
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
