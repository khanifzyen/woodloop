"use client";

import { useState } from "react";
import Link from "next/link";
import { useMarketplaceMaterials, useWoodTypes } from "@/lib/hooks/use-converter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, ShoppingCart } from "lucide-react";

export default function MarketplaceMaterialsPage() {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [search, setSearch] = useState("");
  const { data, isLoading } = useMarketplaceMaterials(filters);
  const { data: woodTypes } = useWoodTypes();
  const items = data?.items ?? [];

  function updateFilter(key: string, value: string | undefined) {
    setFilters((f) => {
      const next = { ...f };
      if (value && value !== "all") next[key] = value;
      else delete next[key];
      return next;
    });
  }

  function handleSearch() {
    updateFilter("search", search || undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Pasar Bahan</h1>
          <p className="text-muted-foreground mt-1">Cari bahan limbah berkualitas untuk produk Anda</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari bahan..."
              className="pl-8 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label>Jenis Kayu</Label>
                  <Select value={(filters.wood_type as string) || "all"} onValueChange={(v) => updateFilter("wood_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Semua jenis" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua jenis</SelectItem>
                      {woodTypes?.map((wt) => <SelectItem key={wt.id} value={wt.id}>{wt.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bentuk</Label>
                  <Select value={(filters.form as string) || "all"} onValueChange={(v) => updateFilter("form", v)}>
                    <SelectTrigger><SelectValue placeholder="Semua bentuk" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua bentuk</SelectItem>
                      <SelectItem value="offcut_large">Offcut Besar</SelectItem>
                      <SelectItem value="offcut_small">Offcut Kecil</SelectItem>
                      <SelectItem value="shaving">Serutan</SelectItem>
                      <SelectItem value="sawdust">Serbuk Gergaji</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Harga Min</Label>
                    <Input type="number" placeholder="0" value={(filters.priceMin as string) || ""}
                      onChange={(e) => updateFilter("priceMin", e.target.value || undefined)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Harga Max</Label>
                    <Input type="number" placeholder="99999" value={(filters.priceMax as string) || ""}
                      onChange={(e) => updateFilter("priceMax", e.target.value || undefined)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Urutkan</Label>
                  <Select value={(filters.sort as string) || "newest"} onValueChange={(v) => updateFilter("sort", v !== "newest" ? v : undefined)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="price_asc">Termurah</SelectItem>
                      <SelectItem value="price_desc">Termahal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full" onClick={() => { setFilters({}); setSearch(""); }}>Reset</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      ) : items.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Belum ada bahan tersedia</p>
          <p className="text-sm text-muted-foreground mt-1">Belum ada inventory dari Aggregator</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const woodName = item.expand?.wood_type?.name || "-";
            const totalPrice = (item.price_per_kg || 0) * (item.weight || 0);
            return (
              <Link key={item.id} href={`/converter/marketplace/materials/${item.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{item.form}</Badge>
                      <Badge>{woodName}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.weight} kg tersedia</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Rp {item.price_per_kg?.toLocaleString("id-ID")}/kg</p>
                        <p className="font-semibold">Rp {totalPrice.toLocaleString("id-ID")}</p>
                      </div>
                      <Button size="sm" variant="default" onClick={(e) => { e.preventDefault(); window.location.href = `/converter/marketplace/materials/${item.id}`; }}>
                        Beli
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
