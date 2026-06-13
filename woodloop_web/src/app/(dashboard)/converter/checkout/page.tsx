"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  useMarketplaceMaterials,
  useCreateMarketplaceTransaction,
} from "@/lib/hooks/use-converter";
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
import { ArrowLeft, ShoppingCart, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const materialId = searchParams.get("material");

  const { data, isLoading } = useMarketplaceMaterials();
  const createTx = useCreateMarketplaceTransaction();

  const item = data?.items?.find((i) => i.id === materialId);

  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "wallet" | "bank_transfer" | "cod"
  >("wallet");

  const woodName = item?.expand?.wood_type?.name || "-";
  const pricePerKg = item?.price_per_kg || 0;
  const totalPrice = pricePerKg * quantity;

  async function handleSubmit() {
    if (!item) return;
    if (quantity <= 0 || quantity > (item.weight || 0)) {
      toast.error(`Quantity harus antara 1-${item.weight} kg`);
      return;
    }
    try {
      await createTx.mutateAsync({
        inventory_item: item.id,
        seller: item.aggregator,
        quantity,
        total_price: totalPrice,
        payment_method: paymentMethod,
      });
      toast.success("Transaksi berhasil dibuat!");
      router.push("/converter/marketplace/history");
    } catch {
      toast.error("Gagal membuat transaksi");
    }
  }

  if (!materialId) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">Tidak ada bahan dipilih</p>
            <p className="text-sm text-muted-foreground mt-1">
              Pilih bahan dari Pasar Bahan terlebih dahulu
            </p>
            <Button asChild className="mt-4">
              <Link href="/converter/marketplace/materials">Pasar Bahan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !item) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/converter/marketplace/materials/${materialId}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Checkout</h1>
          <p className="text-muted-foreground mt-1">
            Konfirmasi pembelian bahan limbah
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Jenis Kayu</span>
              <Badge variant="secondary">{woodName}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bentuk</span>
              <span className="font-medium">{item.form}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Berat Tersedia</span>
              <span className="font-medium">{item.weight} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Harga/kg</span>
              <span className="font-medium">
                Rp {pricePerKg.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Pembelian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg)</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={item.weight}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Min 1 kg, Max {item.weight} kg
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Metode Pembayaran</Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) =>
                  setPaymentMethod(
                    v as "wallet" | "bank_transfer" | "cod"
                  )
                }
              >
                <SelectTrigger id="payment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">Dompet Digital</SelectItem>
                  <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                  <SelectItem value="cod">COD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleSubmit}
                disabled={createTx.isPending}
              >
                <ShoppingCart className="h-4 w-4" />
                {createTx.isPending
                  ? "Memproses..."
                  : `Bayar Rp ${totalPrice.toLocaleString("id-ID")}`}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link
                  href={`/converter/marketplace/materials/${materialId}`}
                >
                  Kembali
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
