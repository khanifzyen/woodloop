"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMarketplaceMaterials, useCreateMarketplaceTransaction } from "@/lib/hooks/use-converter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data } = useMarketplaceMaterials();
  const createTx = useCreateMarketplaceTransaction();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "bank_transfer" | "cod">("wallet");

  const item = data?.items?.find((i) => i.id === params.id);
  const woodName = item?.expand?.wood_type?.name || "-";
  const pricePerKg = item?.price_per_kg || 0;
  const totalPrice = pricePerKg * quantity;

  async function handleBuy() {
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

  if (!item) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/converter/marketplace/materials"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div>
          <h1 className="heading-2">{woodName}</h1>
          <p className="text-muted-foreground">{item.form} • {item.weight} kg</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Detail Bahan</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-muted-foreground">Jenis Kayu</p><p className="font-medium">{woodName}</p></div>
              <div><p className="text-xs text-muted-foreground">Bentuk</p><p className="font-medium">{item.form}</p></div>
              <div><p className="text-xs text-muted-foreground">Berat</p><p className="font-medium">{item.weight} kg</p></div>
              <div><p className="text-xs text-muted-foreground">Harga/kg</p><p className="font-medium">Rp {pricePerKg.toLocaleString("id-ID")}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pembelian</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Quantity (kg)</Label>
              <Input type="number" min={1} max={item.weight} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
              <p className="text-xs text-muted-foreground">Max {item.weight} kg</p>
            </div>
            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "wallet" | "bank_transfer" | "cod")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">Dompet Digital</SelectItem>
                  <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                  <SelectItem value="cod">COD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between mb-2"><span className="text-sm">Total</span><span className="font-bold text-lg">Rp {totalPrice.toLocaleString("id-ID")}</span></div>
              <Button className="w-full gap-2" onClick={handleBuy} disabled={createTx.isPending}>
                <ShoppingCart className="h-4 w-4" />{createTx.isPending ? "Memproses..." : "Beli Langsung"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
