"use client";

import { useState, useMemo } from "react";
import {
  Check,
  X,
  Eye,
  Package,
  Search,
  Loader2,
  ClipboardList,
  XCircle,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  CreditCard,
  Ban,
  Receipt,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSupplierOrders } from "@/lib/hooks/use-supplier";
import { getPB } from "@/lib/pocketbase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { RawTimberOrder, User } from "@/lib/pocketbase/types";

interface OrderWithExpand extends RawTimberOrder {
  expand?: {
    buyer?: User;
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
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
    icon: typeof Clock;
    color: string;
  }
> = {
  payment_pending: {
    label: "Menunggu Pembayaran",
    variant: "outline",
    icon: Clock,
    color: "text-amber-600",
  },
  paid: {
    label: "Dibayar",
    variant: "default",
    icon: CreditCard,
    color: "text-blue-600",
  },
  processing: {
    label: "Diproses",
    variant: "secondary",
    icon: Package,
    color: "text-indigo-600",
  },
  shipped: {
    label: "Dikirim",
    variant: "secondary",
    icon: Truck,
    color: "text-cyan-600",
  },
  received: {
    label: "Diterima",
    variant: "default",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "destructive",
    icon: Ban,
    color: "text-destructive",
  },
};

export default function SupplierOrdersPage() {
  const { data, isLoading, isError, refetch } = useSupplierOrders();
  const qc = useQueryClient();
  const [selectedOrder, setSelectedOrder] =
    useState<OrderWithExpand | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, unknown>[]>(
    [],
  );
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const allOrders: OrderWithExpand[] = data?.items ?? [];

  const orders = useMemo(() => {
    return allOrders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const buyerName = o.expand?.buyer?.name?.toLowerCase() || "";
        if (!buyerName.includes(q)) return false;
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
      toast.success(
        `Status pesanan diubah ke ${statusConfig[status]?.label || status}`,
      );
      qc.invalidateQueries({ queryKey: ["supplier", "orders"] });
    } catch {
      toast.error("Gagal mengubah status");
    }
  }

  async function loadDetails(orderId: string) {
    setDetailsLoading(true);
    try {
      const pb = getPB();
      const result = await pb
        .collection("raw_timber_order_details")
        .getList(1, 100, {
          filter: `order="${orderId}"`,
          expand: "listing,listing.wood_type",
        });
      setOrderDetails(result.items as unknown as Record<string, unknown>[]);
    } catch {
      setOrderDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <ClipboardList className="h-3.5 w-3.5" />
            Manajemen Pesanan
          </div>
          <h1 className="heading-2">Pesanan Masuk</h1>
          <p className="text-sm text-muted-foreground">
            Kelola pesanan kayu dari Generator
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-1">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Cari Pembeli
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama pembeli..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-48">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(statusFilter || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("");
                  setSearch("");
                }}
                className="text-muted-foreground"
              >
                <XCircle className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium mb-2">
            Gagal memuat pesanan
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="-mt-4 flex items-center justify-between rounded-t-xl border-b bg-muted/30 px-6 py-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">
                {filteredCount} Pesanan
                {shownCount !== filteredCount && (
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    (menampilkan {shownCount})
                  </span>
                )}
              </h2>
            </div>
          </div>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
                  <Package className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold">
                  Belum ada pesanan masuk
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Pesanan dari Generator akan muncul di sini
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 text-center">#</TableHead>
                      <TableHead>ID Pesanan</TableHead>
                      <TableHead>Pembeli</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="w-32 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => {
                      const statusConf = statusConfig[order.status] || {
                        label: order.status,
                        variant: "outline" as const,
                        icon: Clock,
                        color: "text-muted-foreground",
                      };
                      const StatusIcon = statusConf.icon;
                      return (
                        <TableRow key={order.id} className="hover:bg-muted/40">
                          <TableCell className="text-center text-sm text-muted-foreground">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {(order.expand?.buyer?.name || "?")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <span className="font-medium">
                                {order.expand?.buyer?.name || order.buyer}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{order.total_quantity ?? 0}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(order.total_price)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={statusConf.variant}
                              className="gap-1"
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusConf.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(order.created)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      loadDetails(order.id);
                                    }}
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="flex flex-col">
                                  <SheetHeader>
                                    <div className="flex items-center gap-2">
                                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Receipt className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <SheetTitle>
                                          Pesanan #{order.id.slice(0, 8)}
                                        </SheetTitle>
                                        <SheetDescription>
                                          {formatDate(order.created)}
                                        </SheetDescription>
                                      </div>
                                    </div>
                                  </SheetHeader>
                                  <div className="mt-6 flex-1 space-y-5 overflow-y-auto px-1">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="rounded-lg border bg-muted/30 p-3">
                                        <p className="text-xs text-muted-foreground">
                                          Pembeli
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                          {order.expand?.buyer?.name ||
                                            order.buyer}
                                        </p>
                                      </div>
                                      <div className="rounded-lg border bg-muted/30 p-3">
                                        <p className="text-xs text-muted-foreground">
                                          Status
                                        </p>
                                        <Badge
                                          variant={statusConf.variant}
                                          className="mt-1"
                                        >
                                          {statusConf.label}
                                        </Badge>
                                      </div>
                                    </div>

                                    <div>
                                      <p className="mb-2 text-sm font-semibold">
                                        Detail Item
                                      </p>
                                      {detailsLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          Memuat...
                                        </div>
                                      ) : orderDetails.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                          Tidak ada detail
                                        </p>
                                      ) : (
                                        <div className="space-y-2">
                                          {orderDetails.map((d) => {
                                            const expand = d.expand as
                                              | Record<string, unknown>
                                              | undefined;
                                            const listing = expand?.listing as
                                              | Record<string, unknown>
                                              | undefined;
                                            const lExpand = listing?.expand as
                                              | Record<string, unknown>
                                              | undefined;
                                            const wt = lExpand?.wood_type as
                                              | Record<string, unknown>
                                              | undefined;
                                            const name =
                                              (wt?.name as string) || "Kayu";
                                            const qty =
                                              (d.quantity as number) || 0;
                                            const price =
                                              (d.unit_price as number) || 0;
                                            const subtotal =
                                              (d.subtotal as number) || 0;
                                            return (
                                              <div
                                                key={d.id as string}
                                                className="flex items-center justify-between rounded-lg border bg-card p-3"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-lg">
                                                    🪵
                                                  </div>
                                                  <div>
                                                    <p className="font-medium">
                                                      {name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                      {qty} ×{" "}
                                                      {formatCurrency(price)}
                                                    </p>
                                                  </div>
                                                </div>
                                                <p className="font-semibold">
                                                  {formatCurrency(subtotal)}
                                                </p>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
                                      <p className="font-semibold">Total</p>
                                      <p className="text-lg font-bold text-primary">
                                        {formatCurrency(order.total_price)}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Quick actions in sheet footer */}
                                  <div className="border-t bg-card px-1 pt-4">
                                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                                      Aksi Cepat
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {order.status === "payment_pending" && (
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() =>
                                            updateStatus(order.id, "paid")
                                          }
                                          className="gap-1"
                                        >
                                          <Check className="h-3 w-3" />
                                          Konfirmasi Bayar
                                        </Button>
                                      )}
                                      {order.status === "paid" && (
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() =>
                                            updateStatus(order.id, "processing")
                                          }
                                          className="gap-1"
                                        >
                                          <Check className="h-3 w-3" />
                                          Proses
                                        </Button>
                                      )}
                                      {order.status === "processing" && (
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() =>
                                            updateStatus(order.id, "shipped")
                                          }
                                          className="gap-1"
                                        >
                                          <Truck className="h-3 w-3" />
                                          Kirim
                                        </Button>
                                      )}
                                      {order.status === "shipped" && (
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() =>
                                            updateStatus(order.id, "received")
                                          }
                                          className="gap-1"
                                        >
                                          <CheckCircle2 className="h-3 w-3" />
                                          Selesai
                                        </Button>
                                      )}
                                      {(order.status === "paid" ||
                                        order.status === "processing") && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            updateStatus(order.id, "cancelled")
                                          }
                                          className="gap-1 text-destructive"
                                        >
                                          <X className="h-3 w-3" />
                                          Batalkan
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>

                              {order.status === "payment_pending" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-emerald-600 hover:bg-emerald-500/10"
                                  onClick={() => updateStatus(order.id, "paid")}
                                  title="Konfirmasi Pembayaran"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {order.status === "paid" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-emerald-600 hover:bg-emerald-500/10"
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
                                  className="h-8 w-8 text-cyan-600 hover:bg-cyan-500/10"
                                  onClick={() =>
                                    updateStatus(order.id, "shipped")
                                  }
                                  title="Tandai Dikirim"
                                >
                                  <Truck className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {order.status === "shipped" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-emerald-600 hover:bg-emerald-500/10"
                                  onClick={() =>
                                    updateStatus(order.id, "received")
                                  }
                                  title="Tandai Diterima"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {(order.status === "paid" ||
                                order.status === "processing") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
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
