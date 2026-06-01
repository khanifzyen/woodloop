"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ShoppingCart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TimberCard, TimberCardSkeleton } from "@/components/features/timber-card";
import {
  useTimberMarketplace,
  useWoodTypes,
} from "@/lib/hooks/use-generator";
import { useTimberCartStore } from "@/lib/stores/timber-cart-store";
import { getFileUrl } from "@/lib/pocketbase/client";
import type { TimberMarketplaceFilter } from "@/lib/hooks/use-generator";
import type { RawTimberListing, WoodType, User } from "@/lib/pocketbase/types";

export default function BuyTimberPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<TimberMarketplaceFilter>({});
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError, refetch } =
    useTimberMarketplace(filters);
  const { data: woodTypes } = useWoodTypes();
  const cartStore = useTimberCartStore();

  const listings = data?.items ?? [];
  const cartCount = cartStore.getItemCount();

  function handleSearch() {
    setFilters((prev) => ({ ...prev, search: search || undefined }));
  }

  function handleAddToCart(listing: RawTimberListing & {
    expand?: { wood_type?: WoodType; supplier?: User };
  }) {
    if (!listing.expand?.supplier?.id || !listing.expand?.supplier?.name) {
      toast.error("Data supplier tidak ditemukan");
      return;
    }

    const photoUrl = listing.photos?.[0]
      ? getFileUrl("raw_timber_listings", listing.id, listing.photos[0])
      : undefined;

    cartStore.addItem({
      listing_id: listing.id,
      listing_name: listing.expand?.wood_type?.name || listing.wood_type,
      unit_price: listing.price,
      stock_available: listing.stock ?? 0,
      supplier_id: listing.expand.supplier.id,
      supplier_name: listing.expand.supplier.name,
      wood_type_name: listing.expand?.wood_type?.name || listing.wood_type,
      photo_url: photoUrl,
    });

    toast.success("Ditambahkan ke keranjang");
  }

  function handleChat(listing: RawTimberListing & {
    expand?: { wood_type?: WoodType; supplier?: User };
  }) {
    const supplierId = listing.expand?.supplier?.id;
    if (!supplierId) {
      toast.error("Data supplier tidak ditemukan");
      return;
    }
    router.push(`/chat?receiver=${supplierId}&product=${listing.id}&wood=${encodeURIComponent(listing.expand?.wood_type?.name || listing.wood_type)}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Beli Kayu Mentah</h1>
          <p className="text-muted-foreground mt-1">
            Cari dan pesan kayu gelondongan dari Supplier
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 relative" asChild>
          <Link href="/generator/cart">
            <ShoppingCart className="h-4 w-4" />
            Keranjang
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Cari Kayu
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

            {/* Filter sheet (mobile) / inline (desktop) */}
            <div className="hidden sm:flex gap-3">
              <div className="w-40">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Jenis Kayu
                </label>
                <Select
                  value={filters.wood_type || ""}
                  onValueChange={(v) =>
                    setFilters((prev) => ({
                      ...prev,
                      wood_type: v === "all" ? undefined : v,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua jenis</SelectItem>
                    {woodTypes?.map((wt) => (
                      <SelectItem key={wt.id} value={wt.id}>
                        {wt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Harga Minimal
                </label>
                <Input
                  type="number"
                  placeholder="Rp 0"
                  value={filters.min_price ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      min_price: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>
              <div className="w-32">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Harga Maksimal
                </label>
                <Input
                  type="number"
                  placeholder="Rp 999jt"
                  value={filters.max_price ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      max_price: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>
            </div>

            {/* Mobile filter button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Filter</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Jenis Kayu</label>
                    <Select
                      value={filters.wood_type || ""}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          wood_type: v === "all" ? undefined : v,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Semua" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua jenis</SelectItem>
                        {woodTypes?.map((wt) => (
                          <SelectItem key={wt.id} value={wt.id}>
                            {wt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">
                        Harga Min
                      </label>
                      <Input
                        type="number"
                        placeholder="Rp 0"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Harga Max
                      </label>
                      <Input
                        type="number"
                        placeholder="Rp 999jt"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setShowFilters(false)}
                  >
                    Terapkan Filter
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {(filters.search || filters.wood_type) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({});
                  setSearch("");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TimberCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat data kayu
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      ) : listings.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium text-muted-foreground">
            Tidak ada kayu tersedia
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Sesuaikan filter atau coba lagi nanti
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setFilters({});
              setSearch("");
            }}
          >
            Reset Filter
          </Button>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Menampilkan {listings.length} kayu tersedia
          </p>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <TimberCard
                key={listing.id}
                listing={listing}
                onAddToCart={handleAddToCart}
                onChat={handleChat}
                cartDisabled={listing.stock !== undefined && listing.stock <= 0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
