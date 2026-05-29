"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useProductDetail } from "@/lib/hooks/use-buyer";
import { useCartStore } from "@/lib/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, TruckIcon, Leaf, Recycle } from "lucide-react";
import { toast } from "sonner";
import { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import Image from "next/image";
import { getFileUrl } from "@/lib/pocketbase/client";

export default function ProductDetailPage() {
  const params = useParams();
  const { data: product, isLoading } = useProductDetail(params.id as string);
  const cart = useCartStore();

  // Inject JSON-LD after data loads
  useEffect(() => {
    if (!product) return;
    const remove: (() => void)[] = [];

    const productScript = document.createElement("script");
    productScript.type = "application/ld+json";
    productScript.id = "jsonld-product";
    productScript.textContent = JSON.stringify(buildProductJsonLd(product));
    document.head.appendChild(productScript);
    remove.push(() => document.getElementById("jsonld-product")?.remove());

    const breadScript = document.createElement("script");
    breadScript.type = "application/ld+json";
    breadScript.id = "jsonld-breadcrumb-product";
    breadScript.textContent = JSON.stringify(buildBreadcrumbJsonLd([
      { name: "Beranda", url: "/" },
      { name: "Marketplace", url: "/buyer/marketplace" },
      { name: product.name, url: `/buyer/product/${product.id}` },
    ]));
    document.head.appendChild(breadScript);
    remove.push(() => document.getElementById("jsonld-breadcrumb-product")?.remove());

    return () => remove.forEach((fn) => fn());
  }, [product]);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /><Skeleton className="h-32 w-full" /></div>;
  if (!product) return <div className="py-12 text-center"><p className="text-muted-foreground">Produk tidak ditemukan</p></div>;

  const tx = product.expand?.source_transactions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/buyer/marketplace"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div>
          <h1 className="heading-2">{product.name}</h1>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline">{product.category}</Badge>
            {product.stock > 0 ? <Badge variant="default">Stok: {product.stock}</Badge> : <Badge variant="secondary">Habis</Badge>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Photo */}
        <Card>
          <CardContent className="pt-6">
            <div className="aspect-[4/3] bg-muted rounded-lg relative flex items-center justify-center">
              {product.photos?.[0] ? (
                <Image src={getFileUrl(product, product.photos[0])} alt={product.name} fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <div className="text-muted-foreground">Tidak ada foto</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info + Buy */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-3xl font-bold">Rp {product.price.toLocaleString("id-ID")}</p>
              {product.expand?.converter && (
                <p className="text-sm text-muted-foreground mt-1">oleh {product.expand.converter.name}</p>
              )}
            </div>
            <p className="text-sm">{product.description || "Tidak ada deskripsi"}</p>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" onClick={() => {
                cart.addItem({ id: product.id, name: product.name, price: product.price, photo: product.photos?.[0] ? getFileUrl(product, product.photos[0]) : undefined });
                toast.success("Ditambahkan ke keranjang!");
              }}>
                <ShoppingCart className="h-4 w-4" />+ Keranjang
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/buyer/checkout?product=${product.id}`}>Beli Langsung</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traceability Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" /> Perjalanan Produk
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tx.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Informasi traceability belum tersedia untuk produk ini.
            </p>
          ) : (
            <div className="space-y-4">
              {tx.map((t, i) => {
                const inv = t.expand?.inventory_item;
                const wood = inv?.expand?.wood_type;
                const seller = t.expand?.seller;
                return (
                  <div key={t.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {i + 1}
                      </div>
                      {i < tx.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">
                        Bahan: {wood?.name || inv?.form || "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dari {seller?.name || "-"} • {inv?.weight} kg • {new Date(t.created).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" /> Dampak Lingkungan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <Recycle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-500">
                {tx.reduce((sum, t) => sum + (t.quantity || 0), 0)} kg
              </p>
              <p className="text-xs text-muted-foreground">Limbah Teralihkan</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <Leaf className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-500">
                {(tx.reduce((sum, t) => sum + (t.quantity || 0), 0) * 1.5).toFixed(1)} kg
              </p>
              <p className="text-xs text-muted-foreground">CO₂ Tersimpan</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
