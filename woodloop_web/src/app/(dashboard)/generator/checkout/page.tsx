"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  useTimberCartStore,
  type TimberCartItem,
} from "@/lib/stores/timber-cart-store";
import { useCreateTimberOrderFromCart } from "@/lib/hooks/use-generator";

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

export default function GeneratorCheckoutPage() {
  const router = useRouter();
  const { items, getGroupedBySupplier, getGrandTotal, getItemCount, clearCart } =
    useTimberCartStore();
  const checkoutMutation = useCreateTimberOrderFromCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const grouped = getGroupedBySupplier();
  const grandTotal = getGrandTotal();
  const itemCount = getItemCount();
  const groupEntries = Array.from(grouped.entries());

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/generator/buy-timber">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="heading-2">Checkout</h1>
            <p className="text-muted-foreground mt-1">
              Keranjang kosong — tidak ada yang bisa di-checkout
            </p>
          </div>
        </div>
        <Card className="p-12 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium text-muted-foreground">
            Keranjang kosong
          </p>
          <Button asChild className="mt-4">
            <Link href="/generator/buy-timber">Beli Kayu</Link>
          </Button>
        </Card>
      </div>
    );
  }

  async function handleCheckout() {
    setIsCheckingOut(true);

    try {
      const groups = groupEntries.map(([supplierId, supplierItems]) => ({
        supplierId,
        items: supplierItems.map((item: TimberCartItem) => ({
          listing: item.listing_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      }));

      const createdOrders = (await checkoutMutation.mutateAsync(groups)) as { id: string }[];
      clearCart();
      toast.success("Semua pesanan berhasil dibuat!");
      const orderIds = createdOrders.map((o) => o.id).join(",");
      router.push(`/generator/order-success?orders=${orderIds}`);
    } catch {
      toast.error("Gagal checkout. Silakan coba lagi.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/generator/cart">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Checkout</h1>
          <p className="text-muted-foreground mt-1">
            Konfirmasi pesanan kayu Anda ({itemCount} item dari{" "}
            {groupEntries.length} supplier)
          </p>
        </div>
      </div>

      {/* Per-supplier summary */}
      {groupEntries.map(([supplierId, supplierItems]) => {
        const supplierTotal = supplierItems.reduce(
          (sum, i) => sum + i.unit_price * i.quantity,
          0
        );
        const supplierName = supplierItems[0]?.supplier_name || "Supplier";

        return (
          <Card key={supplierId}>
            <CardHeader>
              <CardTitle className="text-base">{supplierName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {supplierItems.map((item) => (
                <div
                  key={item.listing_id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.wood_type_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <p className="font-semibold ml-4">
                    {formatCurrency(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Subtotal ({supplierName})
                </span>
                <span className="font-semibold">
                  {formatCurrency(supplierTotal)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Total + Checkout button */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Total {itemCount} item
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(grandTotal)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                * Harga final akan diverifikasi oleh sistem
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              asChild
              disabled={isCheckingOut}
            >
              <Link href="/generator/cart">Kembali ke Keranjang</Link>
            </Button>
            <Button
              className="flex-1"
              size="lg"
              disabled={isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Buat Pesanan"
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            🛡️ Harga akan divalidasi otomatis oleh sistem. Jika ada perubahan
            harga dari Supplier, harga akan disesuaikan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
