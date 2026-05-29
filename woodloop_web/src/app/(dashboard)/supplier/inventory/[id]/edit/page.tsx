"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, ExternalLink } from "lucide-react";
import { PhotoLightbox } from "@/components/features/photo-lightbox";
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
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [existingDoc, setExistingDoc] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    wood_type: "",
    shape: "log" as "log" | "sawn",
    grade: "" as "" | "perhutani" | "kemplengan" | "kayu_rakyat" | "lainnya",
    diameter: "",
    length: "",
    width: "",
    height: "",
    volume: "",
    price: "",
    unit: "m3" as "m3" | "batang" | "ton",
    status: "available" as "available" | "sold",
    description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [legalityDoc, setLegalityDoc] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState("");
  const volumeRef = useRef<HTMLInputElement>(null);

  // Auto-calculate volume when focusing
  function handleVolumeFocus() {
    setForm((prev) => {
      if (prev.volume) return prev;
      const d = Number(prev.diameter);
      const l = Number(prev.length);
      const w = Number(prev.width);
      const h = Number(prev.height);
      let vol = 0;

      if (prev.shape === "log" && d > 0 && l > 0) {
        const r = d / 2 / 100;
        const panjangM = l / 100;
        vol = Math.PI * r * r * panjangM;
      } else if (prev.shape === "sawn" && l > 0 && w > 0 && h > 0) {
        vol = (l / 100) * (w / 100) * (h / 100);
      }

      if (vol > 0) {
        return { ...prev, volume: vol.toFixed(3) };
      }
      return prev;
    });
  }

  function handlePriceChange(raw: string) {
    const numeric = raw.replace(/[^0-9]/g, "");
    if (numeric === "") {
      setPriceDisplay("");
      updateField("price", "");
      return;
    }
    setPriceDisplay(Number(numeric).toLocaleString("id-ID"));
    updateField("price", numeric);
  }

  // Load existing data
  useEffect(() => {
    async function load() {
      try {
        const pb = getPB();
        const record = (await pb
          .collection("raw_timber_listings")
          .getOne(id, { expand: "wood_type", requestKey: null })) as ListingWithExpand;
        setListing(record);
        // Convert photo filenames to full URLs
        const photoUrls = (record.photos || []).map((p: string) =>
          getFileUrl("raw_timber_listings", record.id, p)
        );
        setExistingPhotos(photoUrls);
        // Convert legality doc filename to full URL
        setExistingDoc(record.legality_doc ? [getFileUrl("raw_timber_listings", record.id, record.legality_doc)] : []);
        setForm({
          wood_type: record.wood_type,
          shape: record.shape || "log",
          grade: record.grade || "",
          diameter: record.diameter?.toString() || "",
          length: record.length?.toString() || "",
          width: record.width?.toString() || "",
          height: record.height?.toString() || "",
          volume: record.volume.toString(),
          price: record.price.toString(),
          unit: record.unit,
          status: record.status,
          description: record.description || "",
        });
      } catch (err) {
        console.error("Failed to load listing:", err);
        toast.error("Gagal memuat data kayu: " + (err instanceof Error ? err.message : "Unknown error"));
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
    if (!form.shape) errs.shape = "Pilih bentuk kayu";
    if (!form.volume || Number(form.volume) <= 0)
      errs.volume = "Volume harus diisi";
    if (!form.price || Number(form.price) <= 0) errs.price = "Harga harus diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("wood_type", form.wood_type);
    formData.append("shape", form.shape);
    if (form.grade) formData.append("grade", form.grade);
    if (form.diameter) formData.append("diameter", String(form.diameter));
    if (form.length) formData.append("length", String(form.length));
    if (form.width) formData.append("width", String(form.width));
    if (form.height) formData.append("height", String(form.height));
    formData.append("volume", String(form.volume));
    formData.append("price", String(form.price));
    formData.append("unit", form.unit);
    formData.append("status", form.status);
    if (form.description) formData.append("description", form.description);

    // Append new photo files
    for (const file of photos) {
      formData.append("photos", file);
    }

    // Append legality document if any
    for (const file of legalityDoc) {
      formData.append("legality_doc", file);
    }

    updateMutation.mutate(
      { id, formData },
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
                {/* Jenis Kayu, Bentuk Kayu, Grade Kayu — responsive 3→2→1 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          className={`w-full ${errors.wood_type ? "border-destructive" : ""}`}
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
                      <SelectTrigger id="shape" className={`w-full ${errors.shape ? "border-destructive" : ""}`}>
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
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label htmlFor="grade">Grade Kayu</Label>
                    <Select
                      value={form.grade}
                      onValueChange={(v) => updateField("grade", v as "" | "perhutani" | "kemplengan" | "kayu_rakyat" | "lainnya")}
                    >
                      <SelectTrigger id="grade" className="w-full">
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
                </div>

                {/* Dimensions — depends on shape */}
                {form.shape === "log" ? (
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
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Panjang (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={form.length}
                        onChange={(e) => updateField("length", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Lebar (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={form.width}
                        onChange={(e) => updateField("width", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Tinggi (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={form.height}
                        onChange={(e) => updateField("height", e.target.value)}
                      />
                    </div>
                  </div>
                )}

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
                      ref={volumeRef}
                      onFocus={handleVolumeFocus}
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
                    type="text"
                    inputMode="numeric"
                    value={priceDisplay || (form.price ? Number(form.price).toLocaleString("id-ID") : "")}
                    onChange={(e) => handlePriceChange(e.target.value)}
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
                  enableCamera
                  onFilesChange={setPhotos}
                  initialFiles={existingPhotos}
                  onPhotoClick={(i) => setLightboxIndex(i)}
                />
              </CardContent>
            </Card>

            {/* Legality Document */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dokumen Legalitas</CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  documentMode
                  accept=".pdf"
                  maxFiles={1}
                  onFilesChange={setLegalityDoc}
                  initialFiles={existingDoc}
                  docUrl={existingDoc[0] || undefined}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Photo Lightbox */}
        {lightboxIndex !== null && existingPhotos.length > 0 && (
          <PhotoLightbox
            photos={existingPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() => setLightboxIndex((prev) => prev !== null ? (prev + 1) % existingPhotos.length : 0)}
            onPrev={() => setLightboxIndex((prev) => prev !== null ? (prev - 1 + existingPhotos.length) % existingPhotos.length : 0)}
          />
        )}

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