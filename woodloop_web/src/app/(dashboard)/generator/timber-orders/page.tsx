"use client";

import { useState } from "react";
import { X, Package, Eye } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTimberOrders } from "@/lib/hooks/use-generator";
import { getPB } from "@/lib/pocketbase/client";
import { useQueryClient } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DetailWithExpand = any;

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
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[number] | null>(null);
  const [orderDetails, setOrderDetails] = useState<DetailWithExpand[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  async function loadDetails(orderId: string) {
    setDetailsLoading(true);
    try {
      const pb = getPB();
      const result = await pb.collection("raw_timber_order_details").getList(1, 100, {
        filter: `order="${orderId}"`,
        expand: "listing,listing.wood_type",
      });
      setOrderDetails(result.items as unknown as DetailWithExpand[]);
    } catch {
      setOrderDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  }

  async function cancelOrder(id: string) {
    try {
      const pb = getPB();
      await pb.collection("raw_timber_orders").update(id, { status: "cancelled" });
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
                      <TableHead className="w-10 text-center">#</TableHead>
                      <TableHead>ID Pesanan</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="w-32 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => {
                      const st = statusConfig[order.status] || {
                        label: order.status,
                        variant: "outline" as const,
                      };
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="text-center text-muted-foreground text-sm">{idx + 1}</TableCell>
                          <TableCell className="font-mono text-sm">
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.expand?.seller?.name || order.seller}
                          </TableCell>
                          <TableCell>{order.total_quantity ?? 0}</TableCell>
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
                            <div className="flex items-center justify-end gap-1">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      loadDetails(order.id);
                                    }}
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </SheetTrigger>
                                <SheetContent>
                                  <SheetHeader>
                                    <SheetTitle>Detail Pesanan</SheetTitle>
                                    <SheetDescription>Informasi lengkap pesanan kayu</SheetDescription>
                                  </SheetHeader>
                                  <div className="mt-6 px-1 space-y-5">
                                    <div>
                                      <p className="text-sm font-medium">ID Pesanan</p>
                                      <p className="text-sm font-mono text-muted-foreground">#{order.id.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Supplier</p>
                                      <p className="text-sm text-muted-foreground">{order.expand?.seller?.name || order.seller}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Status</p>
                                      <Badge variant={st.variant}>{st.label}</Badge>
                                    </div>
                                    <Separator />
                                    <p className="text-sm font-medium">Detail Item</p>
                                    {detailsLoading ? (
                                      <p className="text-sm text-muted-foreground">Memuat...</p>
                                    ) : orderDetails.length === 0 ? (
                                      <p className="text-sm text-muted-foreground">Tidak ada detail</p>
                                    ) : (
                                      orderDetails.map((d) => (
                                        <div key={d.id} className="flex items-center justify-between text-sm">
                                          <div>
                                            <p className="font-medium">{d.expand?.listing?.expand?.wood_type?.name || "Kayu"}</p>
                                            <p className="text-xs text-muted-foreground">
                                              {d.quantity} × {formatCurrency(d.unit_price)}
                                            </p>
                                          </div>
                                          <p className="font-semibold">{formatCurrency(d.subtotal)}</p>
                                        </div>
                                      ))
                                    )}
                                    <Separator />
                                    <div className="flex justify-between">
                                      <p className="font-medium">Total</p>
                                      <p className="font-bold text-primary">{formatCurrency(order.total_price)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Tanggal Pesan</p>
                                      <p className="text-sm text-muted-foreground">{formatDate(order.created)}</p>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>

                              {(order.status === "payment_pending" ||
                                order.status === "paid") && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive"
                                      title="Batalkan Pesanan"
                                    >
                                      <X className="h-3.5 w-3.5" />
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
                            </div>
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
