"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Package,
  TreePine,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useRawTimberListings,
  useDeleteRawTimberListing,
  useWoodTypes,
  type TimberListingsFilter,
} from "@/lib/hooks/use-supplier";
import { getFileUrl } from "@/lib/pocketbase/client";

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

import { formatDate } from "@/lib/utils";

const statusLabel: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  available: { label: "Tersedia", variant: "default" },
  sold: { label: "Terjual", variant: "secondary" },
};

export default function InventoryPage() {
  const [filters, setFilters] = useState<TimberListingsFilter>({});
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } =
    useRawTimberListings(filters);
  const deleteMutation = useDeleteRawTimberListing();
  const { data: woodTypes } = useWoodTypes();

  function handleSearch() {
    setFilters((prev) => ({ ...prev, search: search || undefined }));
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Kayu berhasil dihapus");
        setDeleteId(null);
      },
      onError: (err) => {
        toast.error("Gagal menghapus: " + err.message);
      },
    });
  }

  const listings = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;
  const availableCount = listings.filter((l) => l.status === "available").length;
  const soldCount = listings.filter((l) => l.status === "sold").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <TreePine className="h-3.5 w-3.5" />
            Manajemen Kayu
          </div>
          <h1 className="heading-2">Inventaris Kayu</h1>
          <p className="text-sm text-muted-foreground">
            Kelola stok kayu gelondongan Anda
          </p>
        </div>
        <Button
          asChild
          className="h-11 bg-gradient-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20"
        >
          <Link href="/supplier/inventory/new">
            <Plus className="mr-2 h-4 w-4" />
            Daftarkan Kayu Baru
          </Link>
        </Button>
      </div>

      {/* Mini stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Listing</p>
              <p className="text-xl font-bold">{totalItems}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <TreePine className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tersedia</p>
              <p className="text-xl font-bold">{availableCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Terjual</p>
              <p className="text-xl font-bold">{soldCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Cari
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari jenis kayu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <div className="w-44">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Status
              </label>
              <Select
                value={filters.status || "all"}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: (v === "all" ? undefined : v) as
                      | "available"
                      | "sold"
                      | undefined,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="available">Tersedia</SelectItem>
                  <SelectItem value="sold">Terjual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-44">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Jenis Kayu
              </label>
              <Select
                value={filters.wood_type || "all"}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    wood_type: v === "all" ? undefined : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {woodTypes?.map((wt) => (
                    <SelectItem key={wt.id} value={wt.id}>
                      {wt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {Object.keys(filters).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({});
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

      {/* Error state */}
      {isError && (
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium mb-2">
            Gagal memuat inventaris
          </p>
          <p className="text-sm text-muted-foreground mb-4">{error?.message}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <Card className="overflow-hidden">
          <div className="-mt-4 flex items-center justify-between rounded-t-xl border-b bg-muted/30 px-6 py-3">
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">{totalItems} Kayu Terdaftar</h2>
            </div>
          </div>
          <CardContent className="p-0">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
                  <span className="text-5xl">🪵</span>
                </div>
                <h3 className="text-lg font-heading font-semibold">
                  Belum ada kayu terdaftar
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Mulai dengan mendaftarkan kayu Anda dan jual ke seluruh
                  ekosistem WoodLoop
                </p>
                <Button asChild className="mt-5" size="sm">
                  <Link href="/supplier/inventory/new">
                    <Plus className="mr-1.5 h-4 w-4" />
                    Daftarkan Kayu Baru
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Foto</TableHead>
                      <TableHead>Jenis Kayu</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="w-24 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => {
                      const st = statusLabel[listing.status] || {
                        label: listing.status,
                        variant: "outline" as const,
                      };
                      return (
                        <TableRow key={listing.id} className="hover:bg-muted/40">
                          <TableCell>
                            {listing.photos?.[0] ? (
                              <img
                                src={getFileUrl(
                                  "raw_timber_listings",
                                  listing.id,
                                  listing.photos[0],
                                )}
                                alt="foto"
                                className="h-10 w-10 rounded-lg object-cover ring-1 ring-border"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <TreePine className="h-4 w-4" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {listing.expand?.wood_type?.name ||
                              listing.wood_type}
                          </TableCell>
                          <TableCell>{listing.volume}</TableCell>
                          <TableCell>{listing.stock ?? 0}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(listing.price)}
                          </TableCell>
                          <TableCell>{listing.unit}</TableCell>
                          <TableCell>
                            <Badge variant={st.variant}>{st.label}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(listing.created)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                asChild
                              >
                                <Link
                                  href={`/supplier/inventory/${listing.id}/edit`}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Dialog
                                open={deleteId === listing.id}
                                onOpenChange={(open) =>
                                  !open && setDeleteId(null)
                                }
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => setDeleteId(listing.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Hapus Kayu</DialogTitle>
                                    <DialogDescription>
                                      Apakah Anda yakin ingin menghapus listing
                                      kayu ini? Tindakan ini tidak bisa
                                      dibatalkan.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setDeleteId(null)}
                                    >
                                      Batal
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={handleDelete}
                                      disabled={deleteMutation.isPending}
                                    >
                                      {deleteMutation.isPending
                                        ? "Menghapus..."
                                        : "Hapus"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
