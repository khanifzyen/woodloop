"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useBuyerOrders } from "@/lib/hooks/use-buyer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, CheckCircle, TruckIcon, CreditCard } from "lucide-react";
import { getFileUrl } from "@/lib/pocketbase/client";

const statusSteps = [
  { key: "payment_pending", label: "Menunggu Bayar", icon: CreditCard },
  { key: "paid", label: "Dibayar", icon: CheckCircle },
  { key: "processing", label: "Diproses", icon: Package },
  { key: "shipped", label: "Dikirim", icon: TruckIcon },
  { key: "received", label: "Selesai", icon: CheckCircle },
];

export default function OrderDetailPage() {
  const params = useParams();
  const { data } = useBuyerOrders();
  const order = data?.items?.find((o) => o.id === params.id);

  if (!order) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  const currentIdx = statusSteps.findIndex((s) => s.key === order.status);
  const product = order.expand?.product;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/buyer/orders"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div>
          <h1 className="heading-2">Detail Pesanan</h1>
          <p className="text-muted-foreground">#{order.id.slice(0, 8)}</p>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-0">
            {statusSteps.map((step, i) => {
              const isActive = i <= currentIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {i < statusSteps.length - 1 && <div className={`w-px flex-1 ${isActive ? "bg-primary" : "bg-border"}`} />}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Info */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
              {product?.photos?.[0] ? <img src={getFileUrl(product, product.photos[0])} alt="" loading="lazy" className="h-full w-full object-cover rounded" /> : <Package className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div>
              <p className="font-medium">{product?.name || "-"}</p>
              <p className="text-sm text-muted-foreground">{order.quantity} item</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Total</span><p className="font-medium">Rp {order.total_price.toLocaleString("id-ID")}</p></div>
            <div><span className="text-muted-foreground">Status</span><Badge variant={order.status === "received" ? "outline" : "default"} className="mt-0.5">{order.status}</Badge></div>
            <div className="col-span-2"><span className="text-muted-foreground">Alamat</span><p className="font-medium text-sm">{order.shipping_address}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
