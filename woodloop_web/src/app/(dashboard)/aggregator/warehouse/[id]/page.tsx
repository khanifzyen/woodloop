"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useUpdateInventoryPrice } from "@/lib/hooks/use-aggregator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon, ImageIcon, PackageIcon, RulerIcon, WeightIcon, DollarSignIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import type { WarehouseInventory, WoodType, Pickup } from "@/lib/pocketbase/types";
import { getFileUrl } from "@/lib/pocketbase/client";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  in_stock: { label: "Dalam Stok", variant: "default" },
  reserved: { label: "Dipesan", variant: "secondary" },
  sold: { label: "Terjual", variant: "outline" },
};

const formLabels: Record<string, string> = {
  offcut_large: "Offcut Besar",
  offcut_small: "Offcut Kecil",
  shaving: "Serutan",
  sawdust: "Serbuk Gergaji",
  logs_end: "Potongan Kayu",
};

export default function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pb = getPB();
  const updatePrice = useUpdateInventoryPrice();
  const [priceInput, setPriceInput] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: async () => {
      const item = await pb.collection("warehouse_inventory").getOne(id, {
        expand: "wood_type,pickup,pickup.waste_listing,pickup.waste_listing.wood_type,pickup.waste_listing.generator",
      });
      return item as unknown as WarehouseInventory & {
        expand?: {
          wood_type?: WoodType;
          pickup?: Pickup & {
            expand?: {
              waste_listing?: {
                expand?: { wood_type?: WoodType; generator?: { name: string; phone?: string } };
                form?: string; volume?: number; unit?: string;
              };
            };
          };
        };
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/aggregator/warehouse"><ArrowLeftIcon className="h-4 w-4" />Kembali ke Gudang</Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <PackageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">Item tidak ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">Item gudang dengan ID tersebut tidak ada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const woodName = data.expand?.wood_type?.name || "-";
  const pickup = data.expand?.pickup;
  const wasteListing = pickup?.expand?.waste_listing;
  const originGenerator = wasteListing?.expand?.generator;
  const hasPhoto = data.photos && data.photos.length > 0;
  const photoUrl = hasPhoto ? getFileUrl(data, data.photos![0]) : null;
  const totalValue = (data.price_per_kg || 0) * (data.weight || 0);

  const currentPrice = priceInput ?? data.price_per_kg ?? 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back + title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/aggregator/warehouse"><ArrowLeftIcon className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="heading-2">{woodName}</h1>
          <p className="text-muted-foreground text-sm">Detail stok gudang</p>
        </div>
        <div className="ml-auto">
          <Badge variant={statusMap[data.status]?.variant as "default" | "secondary" | "outline" | "destructive"}>
            {statusMap[data.status]?.label || data.status}
          </Badge>
        </div>
      </div>

      {/* Photo */}
      {photoUrl ? (
        <div className="rounded-lg overflow-hidden border aspect-video bg-muted flex items-center justify-center">
          <img src={photoUrl} alt={woodName} loading="lazy" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="rounded-lg border aspect-video bg-muted flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
        </div>
      )}

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <RulerIcon className="h-4 w-4" />
              <span className="text-xs">Bentuk</span>
            </div>
            <p className="font-medium">{formLabels[data.form] || data.form}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <WeightIcon className="h-4 w-4" />
              <span className="text-xs">Berat</span>
            </div>
            <p className="font-medium">{data.weight} kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSignIcon className="h-4 w-4" />
              <span className="text-xs">Total Nilai</span>
            </div>
            <p className="font-medium">Rp {totalValue.toLocaleString("id-ID")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PackageIcon className="h-4 w-4" />
              <span className="text-xs">Jenis Kayu</span>
            </div>
            <p className="font-medium">{woodName}</p>
          </CardContent>
        </Card>
      </div>

      {/* Set Harga */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <p className="font-medium">Set Harga Jual</p>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-muted-foreground">Harga per kg (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={currentPrice || ""}
                onChange={(e) => setPriceInput(Number(e.target.value))}
              />
            </div>
            <Button
              onClick={() => {
                if (currentPrice > 0 && currentPrice !== data.price_per_kg) {
                  updatePrice.mutate(
                    { id: data.id, price_per_kg: currentPrice },
                    { onSuccess: () => { toast.success("Harga diperbarui"); setPriceInput(null); } }
                  );
                }
              }}
              disabled={updatePrice.isPending || !currentPrice || currentPrice === data.price_per_kg}
            >
              {updatePrice.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
          {data.price_per_kg && (
            <p className="text-xs text-muted-foreground">
              Harga saat ini: Rp {data.price_per_kg.toLocaleString("id-ID")} / kg
            </p>
          )}
        </CardContent>
      </Card>

      {/* Origin Pickup Info */}
      {pickup && (
        <Card>
          <CardContent className="pt-4 space-y-2">
            <p className="font-medium">Asal Pickup</p>
            <div className="text-sm space-y-1">
              {originGenerator && (
                <p><span className="text-muted-foreground">Generator:</span> {originGenerator.name}</p>
              )}
              {wasteListing && (
                <>
                  <p><span className="text-muted-foreground">Bentuk:</span> {wasteListing.form} — {wasteListing.volume} {wasteListing.unit}</p>
                  <p><span className="text-muted-foreground">Tanggal:</span> {new Date(pickup.created).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </>
              )}
              <p><span className="text-muted-foreground">Status:</span> {pickup.status}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
