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
import { getPB } from "@/lib/pocketbase/client";
import {
  useWoodTypes,
  useUpdateRawTimberListing,
  useDeleteRawTimberListing,
} from "@/lib/hooks/use-supplier";
import type { RawTimberListing, WoodType } from "@/lib/pocketbase/types";

interface ListingWithExpand extends RawTimberListing {
  expand?: { wood_type?: WoodType };
}

export default function EditTimberListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: woodTypes, isLoading: wtLoading } = useWoodTypes();
  const updateMutation = useUpdateRawTimberListing();
  const deleteMutation = useDeleteRawTimberListing();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<ListingWithExpand | null>(null);
  const [form, setForm] = useState({
    wood_type: "",
    diameter: "",
    length: "",
    volume: "",
    price: "",
    unit: "m3" as "m3" | "batang" | "ton",
    status: "available" as "available" | "sold",
    description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Load existing data
  useEffect(() => {
    async function load() {
      try {
        const pb = getPB();
        const record = (await pb
          .collection("raw_timber_listings")
          .getOne(id, { expand: "wood_type" })) as ListingWithExpand;
        setListing(record);
        setForm({
          wood_type: record.wood_type,
          diameter: record.diameter?.toString() || "",
          length: record.length?.toString() || "",
          volume: record.volume.toString(),
          price: record.price.toString(),
          unit: record.unit,
          status: record.status,
          description: record.description || "",
        });
      } catch (err) {
        toast.error("Gagal memuat data kayu");
        router.push("/supplier/inventory");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.wood_type) errs.wood_type = "Pilih jenis kayu";
    if (!form.volume || Number(form.volume) <= 0)
      errs.volume = "Volume harus diisi";
    if (!form.price || Number(form.price) <= 0) errs.price = "Harga harus diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      wood_type: form.wood_type,
      diameter: form.diameter ? Number(form.diameter) : undefined,
      length: form.length ? Number(form.length) : undefined,
      volume: Number(form.volume),
      price: Number(form.price),
      unit: form.unit,
      status: form.status,
      description: form.description || undefined,
    };

    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Kayu berhasil diperbarui");
          router.push("/supplier/inventory");
        },
        onError: (err) => {
          toast.error("Gagal memperbarui: " + err.message);
        },
      }
    );
  }

  function handleDelete() {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Kayu berhasil dihapus");
        router.push("/supplier/inventory");
      },
      onError: (err) => {
        toast.error("Gagal menghapus: " + err.message);
      },
    });
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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/supplier/inventory">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="heading-2">Edit Kayu</h1>
            <p className="text-muted-foreground mt-1">
              Perbarui detail kayu gelondongan
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
              <DialogTitle>Hapus Kayu</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus listing kayu ini? Tindakan ini
                tidak bisa dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Kayu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Wood Type */}
                <div className="space-y-2">
                  <Label htmlFor="wood_type">
                    Jenis Kayu <span className="text-destructive">*</span>
                  </Label>
                  {wtLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={form.wood_type}
                      onValueChange={(v) => updateField("wood_type", v)}
                    >
                      <SelectTrigger
                        id="wood_type"
                        className={errors.wood_type ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Pilih jenis kayu" />
                      </SelectTrigger>
                      <SelectContent>
                        {woodTypes?.map((wt) => (
                          <SelectItem key={wt.id} value={wt.id}>
                            {wt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.wood_type && (
                    <p className="text-xs text-destructive">
                      {errors.wood_type}
                    </p>
                  )}
                </div>

                {/* Diameter & Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diameter">Diameter (cm)</Label>
                    <Input
                      id="diameter"
                      type="number"
                      value={form.diameter}
                      onChange={(e) => updateField("diameter", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Panjang (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={form.length}
                      onChange={(e) => updateField("length", e.target.value)}
                    />
                  </div>
                </div>

                {/* Volume & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">
                      Volume <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.01"
                      value={form.volume}
                      onChange={(e) => updateField("volume", e.target.value)}
                      className={errors.volume ? "border-destructive" : ""}
                    />
                    {errors.volume && (
                      <p className="text-xs text-destructive">
                        {errors.volume}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Satuan</Label>
                    <Select
                      value={form.unit}
                      onValueChange={(v) =>
                        updateField("unit", v as "m3" | "batang" | "ton")
                      }
                    >
                      <SelectTrigger id="unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m3">m³</SelectItem>
                        <SelectItem value="batang">Batang</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Harga (Rp) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">{errors.price}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      updateField("status", v as "available" | "sold")
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Tersedia</SelectItem>
                      <SelectItem value="sold">Terjual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Foto Kayu</CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  maxFiles={5}
                  onFilesChange={setPhotos}
                  initialFiles={listing.photos}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" type="button" asChild>
            <Link href="/supplier/inventory">Batal</Link>
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
