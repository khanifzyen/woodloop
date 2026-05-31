"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  ImageOff,
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
  CardHeader,
  CardTitle,
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
  DialogTrigger,
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

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  available: { label: "Tersedia", variant: "default" },
  sold: { label: "Terjual", variant: "secondary" },
};

export default function InventoryPage() {
  const [filters, setFilters] = useState<TimberListingsFilter>({});
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useRawTimberListings(filters);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Inventaris Kayu</h1>
          <p className="text-muted-foreground mt-1">
            Kelola stok kayu gelondongan Anda
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/supplier/inventory/new">
            <Plus className="h-4 w-4" />
            Daftarkan Kayu Baru
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Cari
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Cari jenis kayu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button variant="outline" size="icon" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="w-40">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Status
              </label>
              <Select
                value={filters.status || "all"}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: (v === "all" ? undefined : v) as "available" | "sold" | undefined,
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
            <div className="w-40">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
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
              >
                Reset Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error state */}
      {isError && (
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat inventaris
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {data?.totalItems ?? 0} Kayu Terdaftar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {listings.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="text-4xl mb-3">🪵</div>
                <p className="font-medium text-muted-foreground">
                  Belum ada kayu terdaftar
                </p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Mulai dengan mendaftarkan kayu Anda
                </p>
                <Button asChild>
                  <Link href="/supplier/inventory/new">
                    <Plus className="mr-2 h-4 w-4" />
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
                        <TableRow key={listing.id}>
                          <TableCell>
                            {listing.photos?.[0] ? (
                              <img
                                src={getFileUrl("raw_timber_listings", listing.id, listing.photos[0])}
                                alt="foto"
                                className="h-10 w-10 object-cover rounded"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <ImageOff className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {listing.expand?.wood_type?.name ||
                              listing.wood_type}
                          </TableCell>
                          <TableCell>{listing.volume}</TableCell>
                          <TableCell>{listing.stock ?? 0}</TableCell>
                          <TableCell>
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
                                className="h-8 w-8"
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
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => setDeleteId(listing.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Hapus Kayu</DialogTitle>
                                    <DialogDescription>
                                      Apakah Anda yakin ingin menghapus listing
                                      kayu ini? Tindakan ini tidak bisa dibatalkan.
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
