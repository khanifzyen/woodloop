"use client";

import Link from "next/link";
import { Plus, Trash2, Package, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import {
  useWasteListings,
  useDeleteWasteListing,
} from "@/lib/hooks/use-generator";
import { getFileUrl } from "@/lib/pocketbase/client";
import type { WasteListing, WasteForm, WasteStatus } from "@/lib/pocketbase/types";

const formLabels: Record<WasteForm, string> = {
  offcut_large: "Offcut Besar",
  offcut_small: "Offcut Kecil",
  shaving: "Serutan",
  sawdust: "Serbuk Gergaji",
  logs_end: "Potongan Kayu",
};

const statusConfig: Record<
  WasteStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  available: { label: "Tersedia", variant: "default" },
  booked: { label: "Dibooking", variant: "secondary" },
  collected: { label: "Terkumpul", variant: "outline" },
  sold: { label: "Terjual", variant: "destructive" },
};

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

export default function GeneratorWastePage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const filters = statusFilter ? { status: statusFilter } : undefined;
  const { data, isLoading, isError, refetch } = useWasteListings(filters);
  const deleteMutation = useDeleteWasteListing();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const listings = data?.items ?? [];

  async function handleDelete() {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Limbah berhasil dihapus");
        setDeleteId(null);
      },
      onError: (err) => {
        toast.error("Gagal menghapus: " + err.message);
      },
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Daftar Limbah</h1>
          <p className="text-muted-foreground mt-1">
            Kelola limbah kayu yang telah Anda setorkan
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/generator/report-waste">
            <Plus className="h-4 w-4" />
            Setor Limbah Baru
          </Link>
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="w-44">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="available">Tersedia</SelectItem>
                  <SelectItem value="booked">Dibooking</SelectItem>
                  <SelectItem value="collected">Terkumpul</SelectItem>
                  <SelectItem value="sold">Terjual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {statusFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("")}
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError && (
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat data limbah
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      )}

      {/* Loading */}
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

      {/* Table */}
      {!isLoading && !isError && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {listings.length} Limbah
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-muted-foreground">
                  Belum ada limbah disetor
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Setor limbah kayu Anda untuk dijual ke Aggregator
                </p>
                <Button asChild className="mt-4">
                  <Link href="/generator/report-waste">
                    <Plus className="mr-2 h-4 w-4" />
                    Setor Limbah
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
                      <TableHead>Bentuk</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Estimasi Harga</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="w-20 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => {
                      const sc = statusConfig[listing.status] || {
                        label: listing.status,
                        variant: "outline" as const,
                      };
                      return (
                        <TableRow key={listing.id}>
                          <TableCell>
                            {listing.photos?.[0] ? (
                              <img
                                src={getFileUrl("waste_listings", listing.id, listing.photos[0])}
                                alt="Foto limbah"
                                className="h-10 w-10 object-cover rounded"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                -
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {listing.expand?.wood_type?.name || listing.wood_type}
                          </TableCell>
                          <TableCell>
                            {formLabels[listing.form] || listing.form}
                          </TableCell>
                          <TableCell>
                            {listing.volume} {listing.unit}
                          </TableCell>
                          <TableCell>
                            {listing.price_estimate > 0
                              ? formatCurrency(listing.price_estimate)
                              : "Gratis"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={sc.variant}>{sc.label}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(listing.created)}
                          </TableCell>
                          <TableCell className="text-right">
                            {listing.status === "available" && (
                              <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href={`/generator/waste/${listing.id}/edit`}>
                                  <Edit className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Dialog>
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
                                    <DialogTitle>Hapus Limbah</DialogTitle>
                                    <DialogDescription>
                                      Apakah Anda yakin ingin menghapus limbah ini?
                                      Tindakan ini tidak bisa dibatalkan.
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
