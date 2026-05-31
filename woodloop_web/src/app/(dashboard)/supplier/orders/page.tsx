"use client";

import { useState, useMemo } from "react";
import { Check, X, Eye, Package, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { useSupplierOrders } from "@/lib/hooks/use-supplier";
import { getPB } from "@/lib/pocketbase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { RawTimberOrder, User, RawTimberListing } from "@/lib/pocketbase/types";

interface OrderWithExpand extends RawTimberOrder {
  expand?: {
    buyer?: User;
    listing?: RawTimberListing;
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
  const [selectedOrder, setSelectedOrder] = useState<OrderWithExpand | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const allOrders: OrderWithExpand[] = data?.items ?? [];

  const orders = useMemo(() => {
    return allOrders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const buyerName = o.expand?.buyer?.name?.toLowerCase() || "";
        const woodName = o.expand?.listing?.expand?.wood_type?.name?.toLowerCase() || "";
        if (!buyerName.includes(q) && !woodName.includes(q)) return false;
      }
      return true;
    });
  }, [allOrders, statusFilter, search]);

  const filteredCount = allOrders.length;
  const shownCount = orders.length;

  async function updateStatus(id: string, status: string) {
    try {
      const pb = getPB();
      await pb.collection("raw_timber_orders").update(id, { status });
      toast.success(`Status pesanan diubah ke ${statusConfig[status]?.label || status}`);
      qc.invalidateQueries({ queryKey: ["supplier", "orders"] });
    } catch {
      toast.error("Gagal mengubah status");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Pesanan Masuk</h1>
        <p className="text-muted-foreground mt-1">
          Kelola pesanan kayu dari Generator
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="flex gap-2">
                <Input
                  placeholder="Cari pembeli atau jenis kayu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline" size="icon" onClick={() => setSearch(search)}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="w-44">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(statusFilter || search) && (
              <Button variant="ghost" size="sm" onClick={() => { setStatusFilter(""); setSearch(""); }}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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
      ) : isError ? (
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">Gagal memuat pesanan</p>
          <Button variant="outline" onClick={() => refetch()}>Coba Lagi</Button>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {filteredCount} Pesanan {shownCount !== filteredCount && `(menampilkan ${shownCount})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-muted-foreground">Belum ada pesanan masuk</p>
                <p className="text-sm text-muted-foreground mt-1">Pesanan dari Generator akan muncul di sini</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 text-center">#</TableHead>
                      <TableHead>ID Pesanan</TableHead>
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
                    {orders.map((order, idx) => {
                      const statusConf = statusConfig[order.status] || { label: order.status, variant: "outline" as const };
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="text-center text-muted-foreground text-sm">{idx + 1}</TableCell>
                          <TableCell className="font-mono text-sm">#{order.id.slice(0, 8)}</TableCell>
                          <TableCell className="font-medium">{order.expand?.buyer?.name || order.buyer}</TableCell>
                          <TableCell>{order.expand?.listing?.expand?.wood_type?.name || "-"}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>{formatCurrency(order.total_price)}</TableCell>
                          <TableCell>
                            <Badge variant={statusConf.variant}>{statusConf.label}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(order.created)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(order)}>
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </SheetTrigger>
                                <SheetContent>
                                  <SheetHeader>
                                    <SheetTitle>Detail Pesanan</SheetTitle>
                                    <SheetDescription>Informasi lengkap pesanan</SheetDescription>
                                  </SheetHeader>
                                  <div className="mt-6 px-1 space-y-5">
                                    <div>
                                      <p className="text-sm font-medium">ID Pesanan</p>
                                      <p className="text-sm font-mono text-muted-foreground">#{order.id.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Pembeli</p>
                                      <p className="text-sm text-muted-foreground">{order.expand?.buyer?.name || order.buyer}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Produk</p>
                                      <p className="text-sm text-muted-foreground">{order.expand?.listing?.expand?.wood_type?.name || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Jumlah</p>
                                      <p className="text-sm text-muted-foreground">{order.quantity}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Total Harga</p>
                                      <p className="text-sm font-semibold">{formatCurrency(order.total_price)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Tanggal Pesan</p>
                                      <p className="text-sm text-muted-foreground">{formatDate(order.created)}</p>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>

                              {order.status === "payment_pending" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={() => updateStatus(order.id, "paid")} title="Konfirmasi Pembayaran">
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {order.status === "paid" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={() => updateStatus(order.id, "processing")} title="Proses Pesanan">
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {order.status === "processing" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-info" onClick={() => updateStatus(order.id, "shipped")} title="Tandai Dikirim">
                                  <Package className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {(order.status === "paid" || order.status === "processing") && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => updateStatus(order.id, "cancelled")} title="Batalkan Pesanan">
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
