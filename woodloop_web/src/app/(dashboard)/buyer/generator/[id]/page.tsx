"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGeneratorProfile, useGeneratorProducts } from "@/lib/hooks/use-buyer";
import { getFileUrl } from "@/lib/pocketbase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Store, MapPin, Phone, Verified, Package } from "lucide-react";

export default function GeneratorProfilePage() {
  const params = useParams();
  const generatorId = params.id as string;

  const { data: seller, isLoading } = useGeneratorProfile(generatorId);
  const { data: productsData, isLoading: productsLoading } = useGeneratorProducts(generatorId);
  const products = productsData?.items || [];

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!seller) return <div className="py-12 text-center"><p className="text-muted-foreground">Penjual tidak ditemukan</p></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/buyer/furniture"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <h1 className="heading-2">Toko</h1>
      </div>

      {/* Seller Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
              {seller.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{seller.name || "Penjual"}</h2>
                {seller.is_verified && <Verified className="h-4 w-4 text-blue-500" />}
              </div>
              <p className="text-sm text-muted-foreground capitalize">{seller.role}</p>
              {seller.workshop_name && (
                <p className="text-sm text-muted-foreground">{seller.workshop_name}</p>
              )}
            </div>
            <Button variant="outline" asChild>
              <Link href={`/chat?user=${seller.id}`}>Hubungi</Link>
            </Button>
          </div>

          {(seller.address || seller.phone) && (
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              {seller.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {seller.address}
                </div>
              )}
              {seller.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {seller.phone}
                </div>
              )}
            </div>
          )}

          {seller.bio && (
            <p className="text-sm mt-3">{seller.bio}</p>
          )}
        </CardContent>
      </Card>

      {/* Products */}
      <div>
        <h2 className="text-lg font-bold mb-4">Produk ({products.length})</h2>
        {productsLoading ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
          </div>
        ) : products.length === 0 ? (
          <Card><CardContent className="py-8 text-center">
            <Store className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Belum ada produk tersedia</p>
          </CardContent></Card>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <Card key={p.id} className="overflow-hidden group">
                <Link href={`/buyer/furniture/${p.id}`}>
                  <div className="aspect-[4/3] bg-muted relative flex items-center justify-center overflow-hidden">
                    {p.photos?.[0] ? (
                      <Image
                        src={getFileUrl("generator_products", p.id, p.photos[0])}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                </Link>
                <CardContent className="pt-3 pb-4">
                  <Link href={`/buyer/furniture/${p.id}`}>
                    <p className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">{p.name}</p>
                  </Link>
                  <p className="font-bold text-sm mt-1">Rp {p.price.toLocaleString("id-ID")}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{p.category}</Badge>
                    <span className="text-xs text-muted-foreground">Terjual {p.sold_count || 0}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
