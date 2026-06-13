"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useOrderDetail, useCancelOrder, useConfirmReceived } from "@/lib/hooks/use-buyer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, CheckCircle, TruckIcon, CreditCard, XCircle } from "lucide-react";
import { getFileUrl } from "@/lib/pocketbase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusSteps = [
  { key: "payment_pending", label: "Menunggu Bayar", icon: CreditCard },
  { key: "paid", label: "Dibayar", icon: CheckCircle },
  { key: "processing", label: "Diproses", icon: Package },
  { key: "shipped", label: "Dikirim", icon: TruckIcon },
  { key: "received", label: "Selesai", icon: CheckCircle },
];

const statusLabel: Record<string, string> = {
  payment_pending: "Menunggu Bayar",
  paid: "Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  received: "Selesai",
  cancelled: "Dibatalkan",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: order, isLoading } = useOrderDetail(params.id as string);
  const cancelOrder = useCancelOrder();
  const confirmReceived = useConfirmReceived();
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;
  if (!order) return <div className="py-12 text-center"><p className="text-muted-foreground">Pesanan tidak ditemukan</p></div>;

  const currentIdx = statusSteps.findIndex((s) => s.key === order.status);
  const product = order.expand?.product;
  const isCancelled = order.status === "cancelled";

  async function handleCancel() {
    if (!order) return;
    try {
      await cancelOrder.mutateAsync({ orderId: order.id, reason: cancelReason });
      toast.success("Pesanan dibatalkan");
      setCancelOpen(false);
    } catch {
      toast.error("Gagal membatalkan pesanan");
    }
  }

  async function handleConfirmReceived() {
    if (!order) return;
    try {
      await confirmReceived.mutateAsync(order.id);
      toast.success("Pesanan telah diterima");
    } catch {
      toast.error("Gagal konfirmasi penerimaan");
    }
  }

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
      {!isCancelled ? (
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
      ) : (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
            <p className="font-medium text-destructive">Pesanan Dibatalkan</p>
            {order.cancel_reason && (
              <p className="text-sm text-muted-foreground mt-1">Alasan: {order.cancel_reason}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Order Info */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
              {product?.photos?.[0] ? <img src={getFileUrl("products", product.id, product.photos[0])} alt="" loading="lazy" className="h-full w-full object-cover rounded" /> : <Package className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div>
              <p className="font-medium">{product?.name || "-"}</p>
              <p className="text-sm text-muted-foreground">{order.quantity} item</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Total</span><p className="font-medium">Rp {order.total_price.toLocaleString("id-ID")}</p></div>
            <div><span className="text-muted-foreground">Status</span>
              <Badge variant={order.status === "received" ? "outline" : order.status === "cancelled" ? "destructive" : "default"} className="mt-0.5">
                {statusLabel[order.status] || order.status}
              </Badge>
            </div>
            <div className="col-span-2"><span className="text-muted-foreground">Alamat</span><p className="font-medium text-sm">{order.shipping_address}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Cancel — only when payment_pending or paid */}
        {(order.status === "payment_pending" || order.status === "paid") && (
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-destructive gap-2">
                <XCircle className="h-4 w-4" /> Batalkan Pesanan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Batalkan Pesanan?</DialogTitle>
                <DialogDescription>Pesanan yang dibatalkan tidak bisa dikembalikan.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="cancel-reason">Alasan pembatalan</Label>
                <Textarea id="cancel-reason" placeholder="Misal: salah produk, ganti pikiran..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCancelOpen(false)}>Tutup</Button>
                <Button variant="destructive" onClick={handleCancel} disabled={cancelOrder.isPending}>
                  {cancelOrder.isPending ? "Membatalkan..." : "Ya, Batalkan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Confirm Received — only when shipped */}
        {order.status === "shipped" && (
          <Button className="gap-2" onClick={handleConfirmReceived} disabled={confirmReceived.isPending}>
            <CheckCircle className="h-4 w-4" />
            {confirmReceived.isPending ? "Memproses..." : "Pesanan Diterima"}
          </Button>
        )}

        {/* Contact Seller */}
        <Button variant="outline" className="gap-2" asChild>
          <Link href={`/chat?user=${product?.expand?.converter?.id || ""}`}>Hubungi Penjual</Link>
        </Button>
      </div>
    </div>
  );
}
