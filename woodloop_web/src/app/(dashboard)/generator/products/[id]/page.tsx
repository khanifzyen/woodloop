"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff as ImgOff } from "lucide-react";
import { toast } from "sonner";
import { PhotoLightbox } from "@/components/features/photo-lightbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPB, getFileUrl } from "@/lib/pocketbase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { GeneratorProduct, WoodType } from "@/lib/pocketbase/types";

interface ProductWithExpand extends GeneratorProduct {
  expand?: { wood_type?: WoodType };
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

import { formatDate } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  furniture: "Furniture",
  custom_order: "Custom Order",
  raw_material: "Bahan Baku",
  other: "Lainnya",
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Aktif", variant: "default" },
  sold_out: { label: "Habis", variant: "secondary" },
  draft: { label: "Draf", variant: "outline" },
};

export default function GeneratorProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const qc = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductWithExpand | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const pb = getPB();
        const record = (await pb
          .collection("generator_products")
          .getOne(id, { expand: "wood_type", requestKey: null })) as ProductWithExpand;
        setProduct(record);
      } catch {
        toast.error("Gagal memuat produk");
        router.push("/generator/products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function handleDelete() {
    try {
      const pb = getPB();
      await pb.collection("generator_products").delete(id);
      toast.success("Produk berhasil dihapus");
      qc.invalidateQueries({ queryKey: ["generator", "products"] });
      router.push("/generator/products");
    } catch {
      toast.error("Gagal menghapus produk");
    }
    setDeleteOpen(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!product) return null;

  const photoUrls = (product.photos || []).map((p) =>
    getFileUrl("generator_products", product.id, p)
  );
  const st = statusConfig[product.status] || { label: product.status, variant: "outline" as const };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/generator/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="heading-2">{product.name}</h1>
            <p className="text-muted-foreground mt-1">Detail produk</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href={`/generator/products/${product.id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Produk</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus &ldquo;{product.name}&rdquo;? Tindakan ini
                  tidak bisa dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Hapus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Photo Gallery */}
      <Card>
        <CardContent className="pt-6">
          {photoUrls.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {photoUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${product.name} ${i + 1}`}
                  className="h-40 w-40 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setLightboxIndex(i)}
                />
              ))}
            </div>
          ) : (
            <div className="h-40 w-40 rounded-lg bg-muted flex items-center justify-center">
              <ImgOff className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photoUrls}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => prev !== null ? Math.min(prev + 1, photoUrls.length - 1) : 0)}
          onPrev={() => setLightboxIndex((prev) => prev !== null ? Math.max(prev - 1, 0) : 0)}
        />
      )}

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Produk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Kategori</p>
              <p className="font-medium">
                {categoryLabels[product.category] || product.category}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={st.variant}>{st.label}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Harga</p>
              <p className="font-medium">{formatCurrency(product.price)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stok</p>
              <p className="font-medium">{product.stock}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jenis Kayu</p>
              <p className="font-medium">
                {product.expand?.wood_type?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
              <p className="font-medium">{formatDate(product.created)}</p>
            </div>
          </div>

          {product.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
              <p className="text-sm">{product.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
