"use client";

import Link from "next/link";
import { useConverterProducts, useDeleteProduct } from "@/lib/hooks/use-converter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Package, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CatalogPage() {
  const { data, isLoading } = useConverterProducts();
  const deleteProduct = useDeleteProduct();
  const products = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Katalog Produk</h1>
          <p className="text-muted-foreground mt-1">Produk upcycled buatan Anda</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/converter/catalog/new"><Plus className="h-4 w-4" />Buat Produk</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      ) : products.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Belum ada produk</p>
          <p className="text-sm text-muted-foreground mt-1">Buat produk upcycled pertama Anda</p>
          <Button asChild className="mt-4"><Link href="/converter/catalog/new">Buat Produk</Link></Button>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={p.stock > 0 ? "default" : "secondary"}>
                    {p.stock > 0 ? "Active" : "Sold Out"}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                    onClick={() => {
                      deleteProduct.mutate(p.id, {
                        onSuccess: () => toast.success("Produk dihapus"),
                        onError: () => toast.error("Gagal hapus produk"),
                      });
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.category} • Stok: {p.stock}</p>
                <p className="font-semibold mt-2">Rp {p.price.toLocaleString("id-ID")}</p>
                <p className="text-xs text-muted-foreground mt-1">QR: {p.qr_code_id}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/converter/catalog/${p.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
