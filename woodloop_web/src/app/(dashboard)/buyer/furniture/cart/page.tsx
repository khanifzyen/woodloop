"use client";

import Link from "next/link";
import { useFurnitureCartStore } from "@/lib/stores/furniture-cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { ShoppingCart, Trash2, ArrowLeft, Minus, Plus } from "lucide-react";

export default function FurnitureCartPage() {
  const cart = useFurnitureCartStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/buyer/furniture"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div>
          <h1 className="heading-2">Keranjang Furniture</h1>
          <p className="text-muted-foreground">{cart.itemCount()} item</p>
        </div>
      </div>

      {cart.items.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Keranjang masih kosong</p>
          <p className="text-sm text-muted-foreground mt-1">Jelajahi marketplace furniture untuk menemukan produk</p>
          <Button asChild className="mt-4"><Link href="/buyer/furniture">Lihat Furniture</Link></Button>
        </CardContent></Card>
      ) : (
        <>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-muted rounded flex items-center justify-center shrink-0">
                      {item.photo ? <img src={item.photo} alt={item.name} loading="lazy" className="h-full w-full object-cover rounded" /> : <ShoppingCart className="h-6 w-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="font-semibold text-sm">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input className="h-8 w-14 text-center" value={item.quantity} readOnly />
                      <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold text-sm w-20 text-right">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                      onClick={() => cart.removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total ({cart.itemCount()} item)</p>
                  <p className="text-2xl font-bold">Rp {cart.total().toLocaleString("id-ID")}</p>
                </div>
                <Button asChild className="gap-2">
                  <Link href="/buyer/furniture/checkout">Checkout</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
