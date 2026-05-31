"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTimberCartStore } from "@/lib/stores/timber-cart-store";

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

export default function GeneratorCartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getGroupedBySupplier,
    getGrandTotal,
    getItemCount,
  } = useTimberCartStore();

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
            <h1 className="heading-2">Keranjang</h1>
            <p className="text-muted-foreground mt-1">
              Item yang akan dipesan
            </p>
          </div>
        </div>
        <Card className="p-12 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium text-muted-foreground">
            Keranjang kosong
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Tambah kayu dari halaman Beli Kayu
          </p>
          <Button asChild className="mt-4">
            <Link href="/generator/buy-timber">Beli Kayu</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/generator/buy-timber">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="heading-2">Keranjang</h1>
            <p className="text-muted-foreground mt-1">
              {itemCount} item dari {groupEntries.length} supplier
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => {
            clearCart();
            toast.success("Keranjang dikosongkan");
          }}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Kosongkan
        </Button>
      </div>

      {/* Items grouped by supplier */}
      {groupEntries.map(([supplierId, supplierItems]) => {
        const supplierTotal = supplierItems.reduce(
          (sum, i) => sum + i.unit_price * i.quantity,
          0
        );
        const supplierName = supplierItems[0]?.supplier_name || "Supplier";

        return (
          <Card key={supplierId}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {supplierName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supplierItems.map((item) => (
                <div
                  key={item.listing_id}
                  className="flex items-center gap-4 py-2"
                >
                  {/* Photo */}
                  <div className="h-16 w-16 rounded bg-muted overflow-hidden shrink-0">
                    {item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt={item.listing_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.wood_type_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.unit_price)} / unit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stok: {item.stock_available}
                    </p>
                  </div>

                  {/* Quantity stepper */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.listing_id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      className="h-7 w-14 text-center text-sm px-0"
                      value={item.quantity}
                      min={1}
                      max={item.stock_available}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        updateQuantity(item.listing_id, val);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={item.quantity >= item.stock_available}
                      onClick={() =>
                        updateQuantity(item.listing_id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-semibold text-sm">
                      {formatCurrency(item.unit_price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive shrink-0"
                    onClick={() => {
                      removeItem(item.listing_id);
                      toast.success("Item dihapus");
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}

              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
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

      {/* Bottom bar */}
      <Card className="sticky bottom-4">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(grandTotal)}
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/generator/checkout">Checkout</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
