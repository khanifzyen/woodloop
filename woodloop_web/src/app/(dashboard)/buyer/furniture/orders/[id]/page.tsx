"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useFurnitureOrderDetail, useCancelFurnitureOrder, useConfirmFurnitureReceived } from "@/lib/hooks/use-buyer";
import { getFileUrl } from "@/lib/pocketbase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import { ArrowLeft, Store, MapPin, MessageCircle, CreditCard, CheckCircle, Package, Truck, ClipboardCheck, XCircle } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  payment_pending: { label: "Menunggu Bayar", variant: "secondary" },
  paid: { label: "Dibayar", variant: "default" },
  processing: { label: "Diproses", variant: "default" },
  shipped: { label: "Dikirim", variant: "default" },
  received: { label: "Selesai", variant: "outline" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};

const timeline = [
  { key: "payment_pending", label: "Menunggu Bayar", icon: CreditCard },
  { key: "paid", label: "Dibayar", icon: CheckCircle },
  { key: "processing", label: "Diproses", icon: Package },
  { key: "shipped", label: "Dikirim", icon: Truck },
  { key: "received", label: "Selesai", icon: ClipboardCheck },
];

export default function FurnitureOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: order, isLoading } = useFurnitureOrderDetail(id);
  const cancelOrder = useCancelFurnitureOrder();
  const confirmReceived = useConfirmFurnitureReceived();
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState("");

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-48" /></div>;
  if (!order) return <div className="py-12 text-center"><p className="text-muted-foreground">Pesanan tidak ditemukan</p></div>;

  const product = order.expand?.product;
  const seller = order.expand?.seller;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/buyer/furniture/orders"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div>
          <h1 className="heading-2">Detail Pesanan</h1>
          <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8)}</p>
        </div>
      </div>

      {order.status === "cancelled" && (
        <Card className="border-destructive">
          <CardContent className="pt-4 flex items-center gap-3">
            <XCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Pesanan Dibatalkan</p>
              {order.cancel_reason && <p className="text-sm text-muted-foreground">Alasan: {order.cancel_reason}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-muted rounded relative flex items-center justify-center shrink-0 overflow-hidden">
              {product?.photos?.[0] ? (
                <Image src={getFileUrl("generator_products", product.id, product.photos[0])} alt={product.name} fill className="object-cover" sizes="64px" />
              ) : (
                <Store className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{product?.name || "Produk"}</p>
              <p className="text-sm text-muted-foreground">{order.quantity} × Rp {order.total_price.toLocaleString("id-ID")}</p>
            </div>
            <Badge variant={statusMap[order.status]?.variant || "outline"}>
              {statusMap[order.status]?.label || order.status}
            </Badge>
          </div>

          {seller && (
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold">
                  {seller.name?.charAt(0) || "?"}
                </div>
                <span>{seller.name}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/chat?user=${seller.id}`}><MessageCircle className="h-3.5 w-3.5 mr-1" /> Hubungi</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      {order.status !== "cancelled" && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-0 relative">
              {timeline.map((t, i) => {
                const idx = timeline.findIndex((s) => s.key === order.status);
                const isDone = i <= idx;
                const isCurrent = i === idx;
                return (
                  <div key={t.key} className="flex gap-3 items-start py-2 relative">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isDone ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <t.icon className="h-4 w-4" />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className={`w-0.5 h-6 ${isDone && i < idx ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <p className={`text-sm ${isCurrent ? "font-bold" : isDone ? "font-medium" : "text-muted-foreground"}`}>
                        {t.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipping Address */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Alamat Pengiriman</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{order.shipping_address}</p>
        </CardContent>
      </Card>

      {/* Actions */}
      {order.status !== "cancelled" && order.status !== "received" && (
        <div className="flex gap-3">
          {(order.status === "payment_pending" || order.status === "paid") && (
            <Button variant="outline" className="flex-1" onClick={() => setShowCancel(true)}>
              Batalkan Pesanan
            </Button>
          )}
          {order.status === "shipped" && (
            <Button className="flex-1" onClick={async () => {
              await confirmReceived.mutateAsync(order.id);
              router.refresh();
            }} disabled={confirmReceived.isPending}>
              Pesanan Diterima
            </Button>
          )}
        </div>
      )}

      {/* Cancel Dialog */}
      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogContent>
          <DialogHeader><DialogTitle>Batalkan Pesanan?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Pesanan yang dibatalkan tidak bisa dikembalikan.</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Alasan pembatalan</p>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tulis alasan..." />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Tutup</Button></DialogClose>
            <Button variant="destructive" onClick={async () => {
              await cancelOrder.mutateAsync({ orderId: order.id, reason: reason || undefined });
              setShowCancel(false);
              router.refresh();
            }} disabled={cancelOrder.isPending}>
              Ya, Batalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
