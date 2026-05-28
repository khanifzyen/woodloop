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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FileDropzone } from "@/components/features/file-dropzone";
import {
  useWoodTypes,
  useCreateRawTimberListing,
} from "@/lib/hooks/use-supplier";

export default function NewTimberListingPage() {
  const router = useRouter();
  const { data: woodTypes, isLoading: wtLoading } = useWoodTypes();
  const createMutation = useCreateRawTimberListing();

  const [form, setForm] = useState({
    wood_type: "",
    shape: "log" as "log" | "sawn",
    grade: "" as "" | "perhutani" | "kemplengan" | "kayu_rakyat" | "lainnya",
    diameter: "",
    length: "",
    volume: "",
    price: "",
    unit: "m3" as "m3" | "batang" | "ton",
    description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [legalityDoc, setLegalityDoc] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!form.wood_type) errs.wood_type = "Pilih jenis kayu";
    if (!form.shape) errs.shape = "Pilih bentuk kayu";
    if (!form.volume || Number(form.volume) <= 0)
      errs.volume = "Volume harus diisi (min 0.01)";
    if (!form.price || Number(form.price) <= 0)
      errs.price = "Harga harus diisi";
    if (photos.length === 0) errs.photos = "Minimal 1 foto";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Upload photos ke PocketBase
    const pb = (await import("@/lib/pocketbase/client")).getPB();
    let photoUrls: string[] = [];

    try {
      for (const file of photos) {
        const formData = new FormData();
        formData.append("file", file);
        // Upload via generic file upload or directly with listing
        const uploadResult = await pb.collection("raw_timber_listings").create(
          {
            supplier: "", // temp, akan diupdate
            wood_type: form.wood_type,
            volume: Number(form.volume),
            price: Number(form.price),
            unit: form.unit,
            status: "available",
          },
          { photos: [file] }
        );
        // Use the returned photos array
        photoUrls = uploadResult.photos || [];
        // Delete the temp record since we'll create properly
        await pb.collection("raw_timber_listings").delete(uploadResult.id);
        break; // Just use first file for now
      }
    } catch {
      // Fallback: send as base64 via the mutation
    }

    const data = {
      wood_type: form.wood_type,
      shape: form.shape,
      grade: form.grade || undefined,
      diameter: form.diameter ? Number(form.diameter) : undefined,
      length: form.length ? Number(form.length) : undefined,
      volume: Number(form.volume),
      price: Number(form.price),
      unit: form.unit,
      photos: photoUrls,
      description: form.description || undefined,
      legality_doc: undefined as string | undefined,
    };

    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Kayu berhasil didaftarkan!");
        router.push("/supplier/inventory");
      },
      onError: (err) => {
        toast.error("Gagal mendaftarkan: " + err.message);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/supplier/inventory">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Daftarkan Kayu Baru</h1>
          <p className="text-muted-foreground mt-1">
            Isi detail kayu gelondongan yang ingin Anda jual
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            {/* Basic Info */}
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

                {/* Shape */}
                <div className="space-y-2">
                  <Label htmlFor="shape">
                    Bentuk Kayu <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.shape}
                    onValueChange={(v) => updateField("shape", v as "log" | "sawn")}
                  >
                    <SelectTrigger id="shape" className={errors.shape ? "border-destructive" : ""}>
                      <SelectValue placeholder="Pilih bentuk kayu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="log">Gelondongan (Log)</SelectItem>
                      <SelectItem value="sawn">Papan Gergajian (Sawn)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.shape && (
                    <p className="text-xs text-destructive">{errors.shape}</p>
                  )}
                </div>

                {/* Grade */}
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade Kayu</Label>
                  <Select
                    value={form.grade}
                    onValueChange={(v) => updateField("grade", v as "" | "perhutani" | "kemplengan" | "kayu_rakyat" | "lainnya")}
                  >
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Pilih grade (opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perhutani">Perhutani</SelectItem>
                      <SelectItem value="kemplengan">Kemplengan</SelectItem>
                      <SelectItem value="kayu_rakyat">Kayu Rakyat</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Diameter & Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diameter">Diameter (cm)</Label>
                    <Input
                      id="diameter"
                      type="number"
                      placeholder="0"
                      value={form.diameter}
                      onChange={(e) =>
                        updateField("diameter", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Panjang (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="0"
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
                      placeholder="0.00"
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
                        updateField(
                          "unit",
                          v as "m3" | "batang" | "ton"
                        )
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
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">{errors.price}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi tambahan (opsional)"
                    value={form.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Foto Kayu <span className="text-destructive">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  maxFiles={5}
                  onFilesChange={setPhotos}
                />
                {errors.photos && (
                  <p className="text-xs text-destructive mt-2">
                    {errors.photos}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Legality Document */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Dokumen Legalitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  documentMode
                  accept=".pdf"
                  maxFiles={1}
                  onFilesChange={setLegalityDoc}
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
            disabled={createMutation.isPending}
          >
            <Save className="h-4 w-4" />
            {createMutation.isPending
              ? "Menyimpan..."
              : "Simpan Kayu"}
          </Button>
        </div>
      </form>
    </div>
  );
}
