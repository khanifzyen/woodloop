"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { getFileUrl } from "@/lib/pocketbase/client";
import { useFurnitureProductDetail } from "@/lib/hooks/use-buyer";
import { useFurnitureCartStore } from "@/lib/stores/furniture-cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Store, ShoppingCart, Leaf, TrendingUp, Package, User, Verified } from "lucide-react";
import { toast } from "sonner";
import type { GeneratorProduct } from "@/lib/pocketbase/types";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Tersedia", variant: "default" },
  sold_out: { label: "Habis", variant: "outline" },
  draft: { label: "Draf", variant: "secondary" },
};

const categoryMap: Record<string, string> = {
  furniture: "Furniture",
  custom_order: "Custom Order",
  raw_material: "Bahan Baku",
  other: "Lainnya",
};

export default function FurnitureProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: product, isLoading } = useFurnitureProductDetail(id);
  const cart = useFurnitureCartStore();
  const pb = getPB();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-64 w-full" /><Skeleton className="h-32 w-full" /></div>;
  if (!product) return <div className="py-12 text-center"><p className="text-muted-foreground">Produk tidak ditemukan</p></div>;

  const status = statusMap[product.status] || statusMap.active;
  const categoryLabel = categoryMap[product.category] || product.category;

  function handleAddToCart() {
    cart.addItem({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      photo: product!.photos?.[0] ? getFileUrl("generator_products", product!.id, product!.photos[0]) : undefined,
    });
    toast.success(`${product!.name} ditambahkan ke keranjang`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/buyer/furniture"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <h1 className="heading-2">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Gallery */}
        <div className="space-y-3">
          <div className="aspect-[4/3] bg-muted rounded-lg relative flex items-center justify-center overflow-hidden">
            {product.photos?.[0] ? (
              <Image
                src={getFileUrl("generator_products", id, product.photos[0])}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <Store className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          {product.photos?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.photos.map((photo, i) => (
                <div key={i} className="h-16 w-16 bg-muted rounded shrink-0 relative overflow-hidden">
                  <Image
                    src={getFileUrl("generator_products", id, photo)}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{categoryLabel}</Badge>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <p className="text-3xl font-bold">Rp {product.price.toLocaleString("id-ID")}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              Stok: {product.stock}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Terjual: {product.sold_count || 0}
            </div>
          </div>

          {product.expand?.wood_type && (
            <div className="flex items-center gap-1 text-sm">
              <Leaf className="h-4 w-4 text-green-600" />
              Kayu {product.expand.wood_type.name}
            </div>
          )}

          {product.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">Deskripsi</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Seller Info */}
          {product.expand?.generator && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                    {product.expand.generator.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm">{product.expand.generator.name}</p>
                      {product.expand.generator.is_verified && <Verified className="h-3.5 w-3.5 text-blue-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">Generator</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/buyer/generator/${product.expand.generator.id}`}>Lihat Toko</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 gap-2" onClick={handleAddToCart} disabled={product.stock <= 0}>
              <ShoppingCart className="h-4 w-4" />+ Keranjang
            </Button>
            <Button variant="outline" className="flex-1" asChild disabled={product.stock <= 0}>
              <Link href={`/buyer/furniture/checkout?product=${id}`}>Beli Langsung</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
