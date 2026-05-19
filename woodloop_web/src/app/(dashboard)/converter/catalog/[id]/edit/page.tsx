"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useConverterProducts, useUpdateProduct } from "@/lib/hooks/use-converter";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { ProductCategory } from "@/lib/pocketbase/types";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { data } = useConverterProducts();
  const updateProduct = useUpdateProduct();
  const product = data?.items?.find((p) => p.id === params.id);

  const [form, setForm] = useState({ name: "", description: "", category: "furniture" as ProductCategory, price: "", stock: "" });

  useEffect(() => {
    if (product) setForm({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });
  }, [product]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateProduct.mutateAsync({
        id: params.id as string,
        data: {
          name: form.name,
          description: form.description,
          category: form.category,
          price: Number(form.price),
          stock: Number(form.stock),
        },
      });
      toast.success("Produk berhasil diperbarui!");
      router.push("/converter/catalog");
    } catch { toast.error("Gagal update produk"); }
  }

  if (!product) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/converter/catalog"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div><h1 className="heading-2">Edit Produk</h1><p className="text-muted-foreground">{product.name}</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
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
                <Label htmlFor="price">Harga</Label>
                <Input id="price" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input id="stock" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Deskripsi</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" asChild><Link href="/converter/catalog">Batal</Link></Button>
          <Button type="submit" className="gap-2" disabled={updateProduct.isPending}>
            <Save className="h-4 w-4" />{updateProduct.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
