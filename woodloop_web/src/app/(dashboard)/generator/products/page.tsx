"use client";

import Link from "next/link";
import { Plus, Package, ImageOff, Edit, Trash2 } from "lucide-react";
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
import { useGeneratorProducts } from "@/lib/hooks/use-generator";
import { getPB, getFileUrl } from "@/lib/pocketbase/client";
import { useQueryClient } from "@tanstack/react-query";

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

const categoryLabels: Record<string, string> = {
  furniture: "Furniture",
  custom_order: "Custom Order",
  raw_material: "Bahan Baku",
  other: "Lainnya",
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  active: { label: "Aktif", variant: "default" },
  sold_out: { label: "Habis", variant: "secondary" },
  draft: { label: "Draf", variant: "outline" },
};

export default function GeneratorProductsPage() {
  const { data, isLoading, isError, refetch } = useGeneratorProducts();
  const qc = useQueryClient();
  const products = data?.items ?? [];

  async function handleDelete(id: string) {
    try {
      const pb = getPB();
      await pb.collection("generator_products").delete(id);
      toast.success("Produk berhasil dihapus");
      qc.invalidateQueries({ queryKey: ["generator", "products"] });
    } catch (err) {
      toast.error("Gagal menghapus produk");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Produk Saya</h1>
          <p className="text-muted-foreground mt-1">
            Kelola produk furniture dan hasil karya Anda
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/generator/products/new">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {/* Error */}
      {isError && (
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat produk
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
              {products.length} Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-muted-foreground">
                  Belum ada produk
                </p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Mulai dengan menambahkan produk furniture Anda
                </p>
                <Button asChild>
                  <Link href="/generator/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Produk
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Foto</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="w-20 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const st = statusConfig[product.status] || {
                        label: product.status,
                        variant: "outline" as const,
                      };
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.photos?.[0] ? (
                              <img
                                src={product.photos[0]}
                                alt={product.name}
                                className="h-10 w-10 object-cover rounded"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <ImageOff className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            {categoryLabels[product.category] ||
                              product.category}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(product.price)}
                          </TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge variant={st.variant}>{st.label}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(product.created)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Hapus Produk
                                    </DialogTitle>
                                    <DialogDescription>
                                      Apakah Anda yakin ingin menghapus "{product.name}"?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline">Batal</Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDelete(product.id)}
                                    >
                                      Hapus
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
