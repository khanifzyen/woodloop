"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getFileUrl } from "@/lib/pocketbase/client";
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
  const [photoIndex, setPhotoIndex] = useState(0);
  const woodName = listing.expand?.wood_type?.name || listing.wood_type;
  const supplierName = listing.expand?.supplier?.name || "Supplier";
  const photos = listing.photos || [];
  const hasMultiple = photos.length > 1;

  const currentPhoto = photos[photoIndex]
    ? getFileUrl("raw_timber_listings", listing.id, photos[photoIndex])
    : null;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="aspect-[4/3] bg-muted relative group">
        {currentPhoto ? (
          <img
            src={currentPhoto}
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

        {/* Navigation arrows for multiple photos */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
              }}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex((i) => (i + 1) % photos.length);
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="flex gap-1 px-4 pt-2 pb-0">
          {photos.map((photo, i) => (
            <button
              key={photo}
              type="button"
              onClick={() => setPhotoIndex(i)}
              className={`h-8 w-8 rounded border-2 overflow-hidden shrink-0 transition-all ${
                i === photoIndex
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <img
                src={getFileUrl("raw_timber_listings", listing.id, photo)}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

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
              {listing.shape === "log" ? "Log" : listing.shape === "square" ? "Square" : listing.shape === "balok" ? "Balok" : "Papan"}
            </Badge>
          )}
          {listing.grade && (
            <Badge variant="outline" className="text-[10px] capitalize">
              {listing.grade === "hutan_rakyat" ? "Hutan Rakyat" : listing.grade}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(listing.price)}
          </span>
          <div className="flex items-center gap-2">
            {listing.stock !== undefined && listing.stock > 0 && (
              <span className="text-xs text-muted-foreground">
                Stok: {listing.stock}
              </span>
            )}
            {listing.stock !== undefined && listing.stock <= 0 && (
              <span className="text-xs text-destructive">Habis</span>
            )}
            {listing.shape === "log" && listing.diameter ? (
              <span className="text-xs text-muted-foreground">
                ⌀{listing.diameter}cm
              </span>
            ) : listing.shape === "square" && listing.width ? (
              <span className="text-xs text-muted-foreground">
                {listing.width}×{listing.width}cm
              </span>
            ) : (listing.shape === "balok" || listing.shape === "papan") && listing.width && listing.height ? (
              <span className="text-xs text-muted-foreground">
                {listing.width}×{listing.height}cm
              </span>
            ) : null}
          </div>
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
