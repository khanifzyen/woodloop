"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useFurnitureProducts } from "@/lib/hooks/use-buyer";
import { useFurnitureCartStore } from "@/lib/stores/furniture-cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
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
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Search, ShoppingCart, Store, SlidersHorizontal, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { getFileUrl } from "@/lib/pocketbase/client";

export default function FurnitureMarketplacePage() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const isBuyer = user?.role === "buyer";

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const { data, isLoading } = useFurnitureProducts({
    category: category || undefined,
    sort,
    search: search || undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
  });
  const cart = useFurnitureCartStore();
  const products = data?.items ?? [];

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (search) params.set("search", search);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    const qs = params.toString();
    const newPath = qs ? `/buyer/furniture?${qs}` : "/buyer/furniture";
    window.history.replaceState(null, "", newPath);
  }, [category, sort, search, priceMin, priceMax]);

  const categories = [
    { value: "", label: "Semua" },
    { value: "furniture", label: "Furniture" },
    { value: "custom_order", label: "Custom Order" },
    { value: "raw_material", label: "Bahan Baku" },
    { value: "other", label: "Lainnya" },
  ];

  function addToCart(product: NonNullable<typeof products>[0]) {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photos?.[0] ? getFileUrl("generator_products", product.id, product.photos[0]) : undefined,
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Furniture</h1>
        <p className="text-muted-foreground mt-1">Furniture langsung dari pengrajin kayu Jepara</p>
      </div>

      {/* Search + Sort + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari furniture..."
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
                <Input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-full" />
                <span className="text-muted-foreground">—</span>
                <Input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full" />
              </div>
              <Button size="sm" className="w-full" onClick={() => { setPriceMin(""); setPriceMax(""); }}>Reset</Button>
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

        <Button variant="outline" size="icon" asChild>
          <Link href="/buyer/furniture/cart"><ShoppingCart className="h-4 w-4" /></Link>
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
          <p className="text-sm text-muted-foreground mt-1">Belum ada furniture tersedia saat ini</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <Card key={p.id} className="hover:border-primary/50 transition-colors overflow-hidden group">
              <Link href={`/buyer/furniture/${p.id}`}>
                <div className="aspect-[4/3] bg-muted relative flex items-center justify-center overflow-hidden">
                  {p.photos?.[0] ? (
                    <Image
                      src={getFileUrl("generator_products", p.id, p.photos[0])}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <Store className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
              </Link>
              <CardContent className="pt-3 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <Badge variant="outline" className="text-xs">{p.category}</Badge>
                  {p.sold_count > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      {p.sold_count}
                    </div>
                  )}
                </div>
                <Link href={`/buyer/furniture/${p.id}`}>
                  <p className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">{p.name}</p>
                </Link>
                <p className="font-bold text-sm mt-1">Rp {p.price.toLocaleString("id-ID")}</p>
                {p.expand?.generator && (
                  <Link href={`/buyer/generator/${p.expand.generator.id}`} className="text-xs text-muted-foreground hover:text-primary mt-1 inline-block">
                    oleh {p.expand.generator.name}
                  </Link>
                )}
                <Button size="sm" variant="default" className="w-full mt-2 gap-1"
                  onClick={(e) => { e.preventDefault(); addToCart(p); }}>
                  + Keranjang
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
