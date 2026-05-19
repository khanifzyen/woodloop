"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateProduct, useWoodTypes, useConverterTransactions } from "@/lib/hooks/use-converter";
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
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import type { ProductCategory } from "@/lib/pocketbase/types";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: txData } = useConverterTransactions();
  const transactions = txData?.items?.filter((t) => t.status === "paid" || t.status === "received") ?? [];

  const [form, setForm] = useState({
    name: "", description: "", category: "furniture" as ProductCategory,
    price: "", stock: "1",
  });
  const [sourceTx, setSourceTx] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama produk wajib diisi";
    if (!form.price || Number(form.price) <= 0) e.price = "Harga harus diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createProduct.mutateAsync({
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        source_transactions: sourceTx,
      });
      toast.success("Produk berhasil ditambahkan!");
      router.push("/converter/catalog");
    } catch {
      toast.error("Gagal membuat produk");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/converter/catalog"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div><h1 className="heading-2">Buat Produk Baru</h1><p className="text-muted-foreground mt-1">Buat produk upcycled dari bahan limbah</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informasi Produk</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk <span className="text-destructive">*</span></Label>
                <Input id="name" placeholder="Nama produk" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as ProductCategory }))}>
                  <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="decor">Decor</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp) <span className="text-destructive">*</span></Label>
                  <Input id="price" type="number" placeholder="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                  {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok</Label>
                  <Input id="stock" type="number" placeholder="1" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Deskripsi</Label>
                <Textarea id="desc" placeholder="Ceritakan produk Anda..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Source Materials (untuk Traceability)</CardTitle></CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada transaksi. Source materials opsional.</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <label key={tx.id} className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" checked={sourceTx.includes(tx.id)} onChange={(e) => {
                        if (e.target.checked) setSourceTx((p) => [...p, tx.id]);
                        else setSourceTx((p) => p.filter((id) => id !== tx.id));
                      }} className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Rp {tx.total_price.toLocaleString("id-ID")}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.created).toLocaleDateString("id-ID")}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" asChild><Link href="/converter/catalog">Batal</Link></Button>
            <Button type="submit" className="gap-2" disabled={createProduct.isPending}>
              <Save className="h-4 w-4" />{createProduct.isPending ? "Menyimpan..." : "Simpan Produk"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
