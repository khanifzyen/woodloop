"use client";

import Link from "next/link";
import { useWishlist, useToggleWishlist } from "@/lib/hooks/use-buyer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { Heart, Store, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getFileUrl } from "@/lib/pocketbase/client";

export default function WishlistPage() {
  const { data, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const items = data?.items ?? [];

  async function handleRemove(productId: string) {
    try {
      await toggleWishlist.mutateAsync(productId);
      toast.success("Dihapus dari favorit");
    } catch {
      toast.error("Gagal menghapus");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Wishlist</h1>
        <p className="text-muted-foreground mt-1">Produk favorit yang kamu simpan</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Wishlist masih kosong</p>
          <p className="text-sm text-muted-foreground mt-1">Simpan produk favoritmu di sini</p>
          <Button className="mt-4" asChild>
            <Link href="/buyer/marketplace">Jelajahi Marketplace</Link>
          </Button>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const product = item.expand?.product;
            if (!product) return null;
            return (
              <Card key={item.id} className="overflow-hidden group">
                <Link href={`/buyer/product/${product.id}`}>
                  <div className="aspect-[4/3] bg-muted relative flex items-center justify-center overflow-hidden">
                    {product.photos?.[0] ? (
                      <Image
                        src={getFileUrl("products", product.id, product.photos[0])}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <Store className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                </Link>
                <CardContent className="pt-3 pb-4">
                  <Link href={`/buyer/product/${product.id}`}>
                    <p className="font-medium text-sm hover:text-primary transition-colors">{product.name}</p>
                  </Link>
                  <p className="font-bold text-sm mt-1">Rp {product.price.toLocaleString("id-ID")}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 gap-1 text-destructive"
                    onClick={() => handleRemove(product.id)}
                    disabled={toggleWishlist.isPending}
                  >
                    <Trash2 className="h-3 w-3" /> Hapus
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
