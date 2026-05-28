"use client";

import { ImageOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { RawTimberListing, WoodType, User } from "@/lib/pocketbase/types";

interface TimberCardProps {
  listing: RawTimberListing & {
    expand?: { wood_type?: WoodType; supplier?: User };
  };
  onOrder?: (id: string) => void;
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

export function TimberCard({ listing, onOrder }: TimberCardProps) {
  const woodName = listing.expand?.wood_type?.name || listing.wood_type;
  const supplierName = listing.expand?.supplier?.name || "Supplier";

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="aspect-[4/3] bg-muted relative">
        {listing.photos?.[0] ? (
          <img
            src={listing.photos[0]}
            alt={woodName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute top-2 right-2" variant="default">
          {listing.unit}
        </Badge>
        {listing.volume && (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2"
          >
            {listing.volume} m³
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-base truncate">{woodName}</h3>
          <p className="text-xs text-muted-foreground">oleh {supplierName}</p>
        </div>

        {listing.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1">
          {listing.shape && (
            <Badge variant="secondary" className="text-[10px]">
              {listing.shape === "log" ? "Gelondongan" : "Papan Gergajian"}
            </Badge>
          )}
          {listing.grade && (
            <Badge variant="outline" className="text-[10px] capitalize">
              {listing.grade === "kayu_rakyat" ? "Kayu Rakyat" : listing.grade}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(listing.price)}
          </span>
          {listing.shape === "log" && listing.diameter ? (
            <span className="text-xs text-muted-foreground">
              ⌀{listing.diameter}cm
            </span>
          ) : listing.shape === "sawn" && listing.width && listing.height ? (
            <span className="text-xs text-muted-foreground">
              {listing.width}×{listing.height}cm
            </span>
          ) : null}
        </div>
      </CardContent>

      {onOrder && (
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            size="sm"
            onClick={() => onOrder(listing.id)}
          >
            Pesan Sekarang
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function TimberCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}
