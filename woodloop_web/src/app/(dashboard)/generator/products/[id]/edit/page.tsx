"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileDropzone } from "@/components/features/file-dropzone";
import { getPB, getFileUrl } from "@/lib/pocketbase/client";
import {
  useWoodTypes,
  useUpdateGeneratorProduct,
} from "@/lib/hooks/use-generator";
import { useQueryClient } from "@tanstack/react-query";
import type {
  GeneratorProduct,
  GenProductCategory,
  GenProductStatus,
  WoodType,
} from "@/lib/pocketbase/types";

interface ProductWithExpand extends GeneratorProduct {
  expand?: { wood_type?: WoodType };
}

const categoryOptions: { value: GenProductCategory; label: string }[] = [
  { value: "furniture", label: "Furniture" },
  { value: "custom_order", label: "Custom Order" },
  { value: "raw_material", label: "Bahan Baku" },
  { value: "other", label: "Lainnya" },
];

const statusOptions: { value: GenProductStatus; label: string }[] = [
  { value: "active", label: "Aktif" },
  { value: "sold_out", label: "Habis" },
  { value: "draft", label: "Draf" },
];

export default function EditGeneratorProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: woodTypes } = useWoodTypes();
  const updateMutation = useUpdateGeneratorProduct();
  const qc = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductWithExpand | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "furniture" as GenProductCategory,
    price: "",
    stock: "1",
    wood_type: "",
    status: "active" as GenProductStatus,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Load existing product
  useEffect(() => {
    async function load() {
      try {
        const pb = getPB();
        const record = (await pb
          .collection("generator_products")
          .getOne(id, { expand: "wood_type", requestKey: null })) as ProductWithExpand;
        setProduct(record);

        const photoUrls = (record.photos || []).map((p: string) =>
          getFileUrl("generator_products", record.id, p)
        );
        setExistingPhotos(photoUrls);

        setForm({
          name: record.name,
          description: record.description || "",
          category: record.category,
          price: record.price.toString(),
          stock: record.stock.toString(),
          wood_type: record.wood_type || "",
          status: record.status,
        });
      } catch (err) {
        console.error("Failed to load product:", err);
        toast.error("Gagal memuat data produk");
        router.push("/generator/products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nama produk wajib diisi";
    if (!form.price || Number(form.price) <= 0)
      errs.price = "Harga harus diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("category", form.category);
    fd.append("price", String(form.price));
    fd.append("stock", String(form.stock));
    fd.append("status", form.status);
    if (form.description) fd.append("description", form.description);
    if (form.wood_type) fd.append("wood_type", form.wood_type);
    for (const file of photos) {
      fd.append("photos", file);
    }

    updateMutation.mutate(
      { id, formData: fd },
      {
        onSuccess: () => {
          toast.success("Produk berhasil diperbarui!");
          router.push("/generator/products");
        },
        onError: (err) => {
          toast.error("Gagal memperbarui produk: " + err.message);
        },
      }
    );
  }

  async function handleDelete() {
    try {
      const pb = getPB();
      await pb.collection("generator_products").delete(id);
      toast.success("Produk berhasil dihapus");
      qc.invalidateQueries({ queryKey: ["generator", "products"] });
      router.push("/generator/products");
    } catch (err) {
      toast.error("Gagal menghapus produk");
    }
    setDeleteOpen(false);
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

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/generator/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="heading-2">Edit Produk</h1>
            <p className="text-muted-foreground mt-1">
              Perbarui informasi produk
            </p>
          </div>
        </div>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Produk</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus &ldquo;{product.name}&rdquo;? Tindakan ini
                tidak bisa dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    updateField("status", v as GenProductStatus)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
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
                    <SelectItem value="none">
                      {form.wood_type && woodTypes?.find((wt) => wt.id === form.wood_type)
                        ? woodTypes.find((wt) => wt.id === form.wood_type)!.name
                        : "Tidak ada"}
                    </SelectItem>
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
              <CardTitle className="text-lg">Foto Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <FileDropzone
                maxFiles={5}
                enableCamera
                onFilesChange={setPhotos}
                initialFiles={existingPhotos}
              />
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
            disabled={updateMutation.isPending}
          >
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
