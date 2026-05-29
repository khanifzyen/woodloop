"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBuyerOrders } from "@/lib/hooks/use-buyer";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import { getFileUrl } from "@/lib/pocketbase/client";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  payment_pending: { label: "Menunggu Bayar", variant: "secondary" },
  paid: { label: "Dibayar", variant: "default" },
  processing: { label: "Diproses", variant: "default" },
  shipped: { label: "Dikirim", variant: "default" },
  received: { label: "Selesai", variant: "outline" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const { data, isLoading, error } = useBuyerOrders({ status: tab === "all" ? undefined : tab });
  const orders = data?.items ?? [];

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  if (error) return <div className="py-12 text-center text-destructive">Gagal memuat pesanan</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Pesanan Saya</h1>
        <p className="text-muted-foreground mt-1">Lacak status pesanan Anda</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="processing">Diproses</TabsTrigger>
          <TabsTrigger value="shipped">Dikirim</TabsTrigger>
          <TabsTrigger value="received">Selesai</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
      ) : orders.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Belum ada pesanan</p>
          <p className="text-sm text-muted-foreground mt-1">Mulai belanja di marketplace</p>
          <Button asChild className="mt-4"><Link href="/buyer/marketplace">Lihat Marketplace</Link></Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const product = o.expand?.product;
            return (
              <Link key={o.id} href={`/buyer/orders/${o.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-muted rounded flex items-center justify-center shrink-0">
                        {product?.photos?.[0] ? <img src={getFileUrl("products", product.id, product.photos[0])} alt="" loading="lazy" className="h-full w-full object-cover rounded" /> : <Package className="h-6 w-6 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product?.name || "Produk"}</p>
                        <p className="text-xs text-muted-foreground">{o.quantity} × Rp {o.total_price.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={statusMap[o.status]?.variant || "outline"}>
                          {statusMap[o.status]?.label || o.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(o.created).toLocaleDateString("id-ID")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
