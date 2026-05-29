"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProducts } from "@/lib/hooks/use-buyer";
import { useCartStore } from "@/lib/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingCart, Store, Plus } from "lucide-react";
import { toast } from "sonner";
import { buildBreadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { ProductCard } from "@/components/features/product-card";
import { getFileUrl } from "@/lib/pocketbase/client";

export default function MarketplacePage() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useProducts({ category: category || undefined, sort, search: search || undefined });
  const cart = useCartStore();
  const products = data?.items ?? [];

  // Inject JSON-LD after mount
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "jsonld-breadcrumb";
    script.textContent = JSON.stringify(buildBreadcrumbJsonLd([
      { name: "Beranda", url: "/" },
      { name: "Marketplace", url: "/buyer/marketplace" },
    ]));
    document.head.appendChild(script);
    return () => { document.getElementById("jsonld-breadcrumb")?.remove(); };
  }, []);

  const categories = [
    { value: "", label: "Semua" },
    { value: "furniture", label: "Furniture" },
    { value: "decor", label: "Decor" },
    { value: "accessories", label: "Accessories" },
    { value: "art", label: "Art" },
    { value: "other", label: "Lainnya" },
  ];

  function addToCart(product: NonNullable<typeof products>[0]) {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photos?.[0] ? getFileUrl(product, product.photos[0]) : undefined,
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Marketplace</h1>
        <p className="text-muted-foreground mt-1">Produk daur ulang berkualitas dari pengrajin Jepara</p>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari produk..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="price_asc">Termurah</SelectItem>
            <SelectItem value="price_desc">Termahal</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" asChild>
          <Link href="/buyer/cart"><ShoppingCart className="h-4 w-4" /></Link>
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={category} onValueChange={(v) => setCategory(v === category ? "" : v)}>
        <TabsList className="flex-wrap">
          {categories.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Store className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Tidak ada produk</p>
          <p className="text-sm text-muted-foreground mt-1">Belum ada produk tersedia saat ini</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
