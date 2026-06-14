"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/hooks/use-buyer";
import { useCartStore } from "@/lib/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search, SlidersHorizontal, ArrowLeft, Store } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/features/product-card";
import { getFileUrl } from "@/lib/pocketbase/client";

const categoryLabels: Record<string, string> = {
  furniture: "Furniture",
  decor: "Decor",
  accessories: "Accessories",
  art: "Art",
  other: "Lainnya",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();

  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const { data, isLoading } = useProducts({
    category: slug,
    sort,
    search: search || undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
  });
  const cart = useCartStore();
  const products = data?.items ?? [];

  const label = categoryLabels[slug] || slug;

  function addToCart(product: NonNullable<typeof products>[0]) {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photos?.[0] ? getFileUrl("products", product.id, product.photos[0]) : undefined,
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/buyer/marketplace">Marketplace</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/buyer/marketplace">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">{label}</h1>
          <p className="text-muted-foreground mt-1">
            Produk kategori {label.toLowerCase()} dari pengrajin Jepara
          </p>
        </div>
      </div>

      {/* Search + Sort + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-3">
              <p className="text-sm font-medium">Rentang Harga</p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full"
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button size="sm" className="w-full" onClick={() => { setPriceMin(""); setPriceMax(""); }}>
                Reset
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="best_selling">Terlaris</SelectItem>
            <SelectItem value="price_asc">Termurah</SelectItem>
            <SelectItem value="price_desc">Termahal</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          <p className="font-medium">Tidak ada produk di kategori ini</p>
          <p className="text-sm text-muted-foreground mt-1">Belum ada produk tersedia saat ini</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/buyer/marketplace">Lihat Semua Produk</Link>
          </Button>
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
