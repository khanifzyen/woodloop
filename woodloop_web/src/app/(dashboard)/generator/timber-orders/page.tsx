"use client";

import { X, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTimberOrders } from "@/lib/hooks/use-generator";
import { getPB } from "@/lib/pocketbase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/lib/pocketbase/types";

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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  payment_pending: { label: "Menunggu Bayar", variant: "outline" },
  paid: { label: "Dibayar", variant: "default" },
  processing: { label: "Diproses", variant: "default" },
  shipped: { label: "Dikirim", variant: "secondary" },
  received: { label: "Diterima", variant: "default" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};

export default function TimberOrdersPage() {
  const { data, isLoading, isError, refetch } = useTimberOrders();
  const qc = useQueryClient();
  const orders = data?.items ?? [];

  async function cancelOrder(id: string) {
    try {
      const pb = getPB();
      await pb.collection("orders").update(id, { status: "cancelled" });
      toast.success("Pesanan dibatalkan");
      qc.invalidateQueries({ queryKey: ["generator", "timber-orders"] });
    } catch {
      toast.error("Gagal membatalkan pesanan");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Pesanan Kayu</h1>
        <p className="text-muted-foreground mt-1">
          Lacak status pesanan kayu dari Supplier
        </p>
      </div>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat pesanan
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      )}

      {!isLoading && !isError && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {orders.length} Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-muted-foreground">
                  Belum ada pesanan kayu
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pesan kayu dari Supplier di halaman Beli Kayu
                </p>
                <Button asChild className="mt-4">
                  <a href="/generator/buy-timber">Beli Kayu</a>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pesanan</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="w-24 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const st = statusConfig[order.status] || {
                        label: order.status,
                        variant: "outline" as const,
                      };
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.expand?.product?.name || order.product}
                          </TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            {formatCurrency(order.total_price)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={st.variant}>{st.label}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(order.created)}
                          </TableCell>
                          <TableCell className="text-right">
                            {(order.status === "payment_pending" ||
                              order.status === "paid") && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive h-8 gap-1"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    Batal
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Batalkan Pesanan
                                    </DialogTitle>
                                    <DialogDescription>
                                      Apakah Anda yakin ingin membatalkan
                                      pesanan ini?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline">
                                      Tidak
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        cancelOrder(order.id)
                                      }
                                    >
                                      Ya, Batalkan
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
