"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFurnitureCartStore } from "@/lib/stores/furniture-cart-store";
import { useCreateFurnitureOrders, useFurnitureProductDetail, usePayOrder } from "@/lib/hooks/use-buyer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function FurnitureCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directProductId = searchParams.get("product");
  const cart = useFurnitureCartStore();
  const createOrders = useCreateFurnitureOrders();
  const payOrder = usePayOrder();
  const { data: directProduct } = directProductId ? useFurnitureProductDetail(directProductId) : { data: null };

  const items = directProduct
    ? [{ id: directProduct.id, name: directProduct.name, price: directProduct.price, quantity: 1, sellerId: directProduct.generator }]
    : cart.items.map((i) => ({ ...i, sellerId: "" }));

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const [form, setForm] = useState({
    name: "", phone: "", address: "", notes: "", payment_method: "bank_transfer" as string,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handlePayNow(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nama wajib diisi";
    if (!form.address.trim()) errs.address = "Alamat wajib diisi";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const shippingAddr = `${form.name}, ${form.phone}, ${form.address}`;

    try {
      const sellerId = directProduct ? directProduct.generator : "";
      const createdOrders = await createOrders.mutateAsync({
        items: items.map((i) => ({
          productId: i.id,
          sellerId: sellerId || i.sellerId,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: shippingAddr,
        paymentMethod: form.payment_method,
      });

      if (!directProduct) cart.clearCart();

      if (form.payment_method !== "cod" && createdOrders.length > 0) {
        const firstOrder = createdOrders[0];
        const { token } = await payOrder.mutateAsync(firstOrder.id);
        await openMidtransSnap(token, () => {
          toast.success("Pembayaran berhasil!");
          router.push("/buyer/furniture/orders");
        });
      } else {
        toast.success("Pesanan berhasil dibuat!");
        router.push("/buyer/furniture/orders");
      }
    } catch {
      toast.error("Gagal membuat pesanan");
    }
  }

  async function openMidtransSnap(token: string, onSuccess: () => void) {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const snapUrl = clientKey
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    const script = document.createElement("script");
    script.src = snapUrl;
    script.setAttribute("data-client-key", clientKey || "");
    script.onload = () => {
      (window as any).snap.pay(token, {
        onSuccess,
        onPending: () => toast.info("Pembayaran sedang diproses"),
        onError: () => toast.error("Pembayaran gagal"),
      });
    };
    document.body.appendChild(script);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href={directProduct ? `/buyer/furniture/${directProductId}` : "/buyer/furniture/cart"}><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div><h1 className="heading-2">Checkout Furniture</h1></div>
      </div>

      <Card>
        <CardHeader><CardTitle>Ringkasan Pesanan</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t font-bold">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handlePayNow}>
        <Card>
          <CardHeader><CardTitle>Alamat Pengiriman</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama <span className="text-destructive">*</span></Label>
                <Input id="name" placeholder="Nama penerima" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" placeholder="0812..." value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap <span className="text-destructive">*</span></Label>
              <Textarea id="address" placeholder="Jalan, kota, provinsi, kode pos" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment">Metode Pembayaran</Label>
              <Select value={form.payment_method} onValueChange={(v) => setForm((f) => ({ ...f, payment_method: v }))}>
                <SelectTrigger id="payment"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="midtrans">QRIS / Virtual Account / Bank Transfer</SelectItem>
                  <SelectItem value="bank_transfer">Transfer Bank Manual</SelectItem>
                  <SelectItem value="cod">COD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea id="notes" placeholder="Catatan untuk penjual" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full gap-2" disabled={createOrders.isPending || payOrder.isPending}>
          {createOrders.isPending || payOrder.isPending
            ? "Memproses..."
            : `Bayar Rp ${total.toLocaleString("id-ID")}`
          }
        </Button>
      </form>
    </div>
  );
}
