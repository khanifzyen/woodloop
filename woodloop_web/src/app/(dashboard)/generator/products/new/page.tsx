"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileDropzone } from "@/components/features/file-dropzone";
import {
  useWoodTypes,
  useCreateGeneratorProduct,
} from "@/lib/hooks/use-generator";
import type { GenProductCategory } from "@/lib/pocketbase/types";

const categoryOptions: { value: GenProductCategory; label: string }[] = [
  { value: "furniture", label: "Furniture" },
  { value: "custom_order", label: "Custom Order" },
  { value: "raw_material", label: "Bahan Baku" },
  { value: "other", label: "Lainnya" },
];

export default function NewGeneratorProductPage() {
  const router = useRouter();
  const { data: woodTypes } = useWoodTypes();
  const createMutation = useCreateGeneratorProduct();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "furniture" as GenProductCategory,
    price: "",
    stock: "1",
    wood_type: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nama produk wajib diisi";
    if (!form.price || Number(form.price) <= 0)
      errs.price = "Harga harus diisi";
    if (photos.length === 0) errs.photos = "Minimal 1 foto produk";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    createMutation.mutate(
      {
        name: form.name,
        description: form.description || undefined,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        photos: [], // Photo upload will be handled separately
        wood_type: form.wood_type || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Produk berhasil ditambahkan!");
          router.push("/generator/products");
        },
        onError: (err) => {
          toast.error("Gagal menambahkan produk: " + err.message);
        },
      }
    );
  }

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/generator/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Tambah Produk Baru</h1>
          <p className="text-muted-foreground mt-1">
            Daftarkan produk furniture atau hasil karya Anda
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Produk <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Contoh: Meja Jati Minimalis"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi produk (opsional)"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    updateField("category", v as GenProductCategory)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Wood Type */}
              <div className="space-y-2">
                <Label htmlFor="wood_type">Jenis Kayu</Label>
                <Select
                  value={form.wood_type}
                  onValueChange={(v) => updateField("wood_type", v)}
                >
                  <SelectTrigger id="wood_type">
                    <SelectValue placeholder="Pilih jenis kayu (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada</SelectItem>
                    {woodTypes?.map((wt) => (
                      <SelectItem key={wt.id} value={wt.id}>
                        {wt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Harga (Rp) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">
                      {errors.price}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => updateField("stock", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Foto Produk <span className="text-destructive">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileDropzone maxFiles={5} onFilesChange={setPhotos} />
              {errors.photos && (
                <p className="text-xs text-destructive mt-2">
                  {errors.photos}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" type="button" asChild>
            <Link href="/generator/products">Batal</Link>
          </Button>
          <Button
            type="submit"
            className="gap-2"
            disabled={createMutation.isPending}
          >
            <Save className="h-4 w-4" />
            {createMutation.isPending ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </div>
      </form>
    </div>
  );
}
