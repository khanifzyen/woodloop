"use client";

import { useState } from "react";
import { Check, X, Eye, Package } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSupplierOrders } from "@/lib/hooks/use-supplier";
import { getPB } from "@/lib/pocketbase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Order, User, Product } from "@/lib/pocketbase/types";

interface OrderWithExpand extends Order {
  expand?: {
    buyer?: User;
    product?: Product;
  };
}

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
  payment_pending: { label: "Menunggu Pembayaran", variant: "outline" },
  paid: { label: "Dibayar", variant: "default" },
  processing: { label: "Diproses", variant: "default" },
  shipped: { label: "Dikirim", variant: "secondary" },
  received: { label: "Diterima", variant: "default" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};

export default function SupplierOrdersPage() {
  const { data, isLoading, isError, refetch } = useSupplierOrders();
  const qc = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithExpand | null>(
    null
  );

  const orders: OrderWithExpand[] = (
    data?.items ?? []
  ).filter((o) => o.status !== "cancelled");

  async function updateStatus(id: string, status: Order["status"]) {
    try {
      const pb = getPB();
      await pb.collection("orders").update(id, { status });
      toast.success(`Status pesanan diubah ke ${statusConfig[status]?.label || status}`);
      qc.invalidateQueries({ queryKey: ["supplier", "orders"] });
    } catch (err) {
      toast.error("Gagal mengubah status");
    }
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="heading-2">Pesanan Masuk</h1>
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat pesanan
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Pesanan Masuk</h1>
        <p className="text-muted-foreground mt-1">
          Kelola pesanan kayu dari Generator
        </p>
      </div>

      {isLoading ? (
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
      ) : (
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
                  Belum ada pesanan masuk
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pesanan dari Generator akan muncul di sini
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pembeli</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="w-32 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const statusConf =
                        statusConfig[order.status] || {
                          label: order.status,
                          variant: "outline" as const,
                        };
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.expand?.buyer?.name || order.buyer}
                          </TableCell>
                          <TableCell>
                            {order.expand?.product?.name || order.product}
                          </TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            {formatCurrency(order.total_price)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConf.variant}>
                              {statusConf.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(order.created)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              {/* Detail Sheet */}
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </SheetTrigger>
                                <SheetContent>
                                  <SheetHeader>
                                    <SheetTitle>Detail Pesanan</SheetTitle>
                                    <SheetDescription>
                                      Informasi lengkap pesanan
                                    </SheetDescription>
                                  </SheetHeader>
                                  <div className="mt-6 space-y-4">
                                    <div>
                                      <p className="text-sm font-medium">
                                        Pembeli
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {order.expand?.buyer?.name ||
                                          order.buyer}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Produk
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {order.expand?.product?.name ||
                                          order.product}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Jumlah
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {order.quantity}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Total Harga
                                      </p>
                                      <p className="text-sm font-semibold">
                                        {formatCurrency(order.total_price)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Alamat Pengiriman
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {order.shipping_address || "-"}
                                      </p>
                                    </div>
                                    <Separator />
                                    <div>
                                      <p className="text-sm font-medium">
                                        Tanggal Pesan
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {formatDate(order.created)}
                                      </p>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>

                              {/* Action buttons */}
                              {order.status === "paid" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-success"
                                  onClick={() =>
                                    updateStatus(order.id, "processing")
                                  }
                                  title="Proses Pesanan"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {order.status === "processing" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-info"
                                  onClick={() =>
                                    updateStatus(order.id, "shipped")
                                  }
                                  title="Tandai Dikirim"
                                >
                                  <Package className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {(order.status === "paid" ||
                                order.status === "processing") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() =>
                                    updateStatus(order.id, "cancelled")
                                  }
                                  title="Batalkan Pesanan"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
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
