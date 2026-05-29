import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Plus } from "lucide-react";

import { getFileUrl } from "@/lib/pocketbase/client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProductLike = any;

interface ProductCardProps {
  product: ProductLike;
  onAddToCart: (product: ProductLike) => void;
}

export const ProductCard = React.memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors overflow-hidden group">
      <Link href={`/buyer/product/${product.id}`}>
        <div className="aspect-[4/3] bg-muted relative flex items-center justify-center overflow-hidden">
          {product.photos?.[0] ? (
            <Image
              src={getFileUrl(product, product.photos[0])}
              alt={product.name}
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
          <Badge variant="outline" className="text-xs">{product.category}</Badge>
        </div>
        <Link href={`/buyer/product/${product.id}`}>
          <p className="font-medium text-sm hover:text-primary transition-colors">{product.name}</p>
        </Link>
        <p className="font-bold text-sm mt-1">Rp {product.price.toLocaleString("id-ID")}</p>
        {product.expand?.converter && (
          <p className="text-xs text-muted-foreground mt-1">oleh {product.expand.converter.name}</p>
        )}
        <Button size="sm" variant="default" className="w-full mt-2 gap-1"
          onClick={(e) => { e.preventDefault(); onAddToCart(product); }}>
          <Plus className="h-3 w-3" /> Keranjang
        </Button>
      </CardContent>
    </Card>
  );
});
