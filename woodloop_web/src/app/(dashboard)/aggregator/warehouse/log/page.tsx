"use client";

import { useWarehouseInventory } from "@/lib/hooks/use-aggregator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, PackageIcon } from "lucide-react";
import Link from "next/link";

export default function WarehouseLogPage() {
  const { data, isLoading } = useWarehouseInventory();

  const items = data?.items ?? [];

  const inStock = items.filter((i) => i.status === "in_stock");
  const sold = items.filter((i) => i.status === "sold");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/aggregator/warehouse">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Log Inventori</h1>
          <p className="text-muted-foreground mt-1">Riwayat barang masuk dan keluar gudang</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Barang Masuk */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-green-500" />
              Barang Masuk
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : inStock.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada barang masuk
              </p>
            ) : (
              <div className="space-y-2">
                {inStock.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">
                        {item.expand?.wood_type?.name || "-"} — {item.form}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.weight} kg
                        {item.price_per_kg ? ` • Rp ${item.price_per_kg}/kg` : ""}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(item.created).toLocaleDateString("id-ID")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Barang Keluar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-red-500" />
              Barang Keluar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : sold.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada barang terjual
              </p>
            ) : (
              <div className="space-y-2">
                {sold.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">
                        {item.expand?.wood_type?.name || "-"} — {item.form}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.weight} kg
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Terjual
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
