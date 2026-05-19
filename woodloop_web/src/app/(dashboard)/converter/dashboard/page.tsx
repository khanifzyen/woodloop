"use client";

import { useConverterDashboard } from "@/lib/hooks/use-converter";
import { SummaryCards } from "@/components/features/summary-cards";
import { ShoppingCart, Palette, DollarSign, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConverterDashboardPage() {
  const { data, isLoading } = useConverterDashboard();

  const items = [
    { title: "Bahan Dibeli", value: data?.materialsBought ?? 0, icon: ShoppingCart },
    { title: "Produk Dibuat", value: data?.productsCreated ?? 0, icon: Palette },
    { title: "Total Investasi", value: data?.totalInvestment ?? 0, icon: DollarSign, prefix: "Rp " },
    { title: "Desain Tersedia", value: data?.designsAvailable ?? 0, icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Dashboard Converter</h1>
          <p className="text-muted-foreground mt-1">
            Beli bahan limbah, buat produk daur ulang, dan dapatkan inspirasi desain.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/converter/marketplace/materials">Cari Bahan</Link>
          </Button>
          <Button asChild>
            <Link href="/converter/catalog/new">Buat Produk</Link>
          </Button>
        </div>
      </div>

      <SummaryCards items={items} loading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : data?.recentTransactions?.length ? (
            <div className="space-y-2">
              {data.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Rp {tx.total_price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.status} — {new Date(tx.created).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada transaksi</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
