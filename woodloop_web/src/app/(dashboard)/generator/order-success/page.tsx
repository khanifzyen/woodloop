"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GeneratorOrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderIds = searchParams.get("orders") || "";

  return (
    <div className="max-w-lg mx-auto space-y-6 text-center pt-12">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div>
        <h1 className="heading-2">Pesanan Berhasil Dibuat!</h1>
        <p className="text-muted-foreground mt-2">
          Pesanan kayu Anda sedang diproses oleh Supplier. Anda akan mendapat
          notifikasi saat status pesanan berubah.
        </p>
      </div>

      {orderIds && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground mb-2">ID Pesanan:</p>
            <div className="space-y-1">
              {orderIds.split(",").map((id) => (
                <p key={id} className="text-xs font-mono text-muted-foreground">
                  {id}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 pt-4">
        <Button asChild size="lg" className="gap-2">
          <Link href="/generator/timber-orders">
            Lihat Pesanan Saya
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/generator/buy-timber">
            <ShoppingBag className="h-4 w-4" />
            Beli Kayu Lagi
          </Link>
        </Button>
      </div>
    </div>
  );
}
