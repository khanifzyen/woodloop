"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMarketplaceMaterials } from "@/lib/hooks/use-converter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function MaterialDetailPage() {
  const params = useParams();
  const { data } = useMarketplaceMaterials();

  const item = data?.items?.find((i) => i.id === params.id);
  const woodName = item?.expand?.wood_type?.name || "-";
  const pricePerKg = item?.price_per_kg || 0;

  if (!item) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/converter/marketplace/materials"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div>
          <h1 className="heading-2">{woodName}</h1>
          <p className="text-muted-foreground">{item.form} • {item.weight} kg</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Detail Bahan</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-muted-foreground">Jenis Kayu</p><p className="font-medium">{woodName}</p></div>
              <div><p className="text-xs text-muted-foreground">Bentuk</p><p className="font-medium">{item.form}</p></div>
              <div><p className="text-xs text-muted-foreground">Berat</p><p className="font-medium">{item.weight} kg</p></div>
              <div><p className="text-xs text-muted-foreground">Harga/kg</p><p className="font-medium">Rp {pricePerKg.toLocaleString("id-ID")}</p></div>
              {item.expand?.aggregator && (
                <div className="col-span-2"><p className="text-xs text-muted-foreground">Aggregator</p><p className="font-medium">{item.expand.aggregator.name || item.aggregator?.slice(0, 8)}</p></div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pembelian</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Harga/kg</p>
              <p className="text-2xl font-bold">Rp {pricePerKg.toLocaleString("id-ID")}</p>
            </div>
            <Badge variant="outline" className="w-fit">{item.weight} kg tersedia</Badge>
            <div className="pt-2">
              <Button className="w-full gap-2" size="lg" asChild>
                <Link href={`/converter/checkout?material=${item.id}`}>
                  <ShoppingCart className="h-4 w-4" />Lanjut ke Checkout
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
