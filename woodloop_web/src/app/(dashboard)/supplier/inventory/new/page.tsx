"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  TreePine,
  Ruler,
  DollarSign,
  FileText,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
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
import type { TimberShape } from "@/lib/pocketbase/types";
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
    shape: "log" as TimberShape,
    grade: "" as "" | "perhutani" | "hutan_rakyat" | "lainnya",
    diameter: "",
    length: "",
    width: "",
    height: "",
    volume: "",
    price: "",
    stock: "",
    unit: "m3" as "m3" | "batang" | "ton",
    description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [legalityDoc, setLegalityDoc] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priceDisplay, setPriceDisplay] = useState("");
  const volumeRef = useRef<HTMLInputElement>(null);

  // Auto-calculate volume when focusing on volume field
  function handleVolumeFocus() {
    setForm((prev) => {
      if (prev.volume) return prev; // skip if already filled
      const d = Number(prev.diameter);
      const l = Number(prev.length);
      const w = Number(prev.width);
      const h = Number(prev.height);
      let vol = 0;

      if (prev.shape === "log" && d > 0 && l > 0) {
        // Volume silinder: π × r² × panjang (dalam m³)
        const r = d / 2 / 100;
        const panjangM = l / 100;
        vol = Math.PI * r * r * panjangM;
      } else if (prev.shape === "square" && w > 0 && l > 0) {
        // Volume balok persegi: w × w × l (dalam m³)
        vol = (w / 100) * (w / 100) * (l / 100);
      } else if (
        (prev.shape === "balok" || prev.shape === "papan") &&
        l > 0 &&
        w > 0 &&
        h > 0
      ) {
        // Volume balok/papan: p × l × t (dalam m³)
        vol = (l / 100) * (w / 100) * (h / 100);
      }

      if (vol > 0) {
        return { ...prev, volume: vol.toFixed(3) };
      }
      return prev;
    });
  }

  // Format price dengan thousand separator
  function handlePriceChange(raw: string) {
    // Hanya angka
    const numeric = raw.replace(/[^0-9]/g, "");
    if (numeric === "") {
      setPriceDisplay("");
      updateField("price", "");
      return;
    }
    setPriceDisplay(Number(numeric).toLocaleString("id-ID"));
    updateField("price", numeric);
  }

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

    const pb = (await import("@/lib/pocketbase/client")).getPB();
    const supplierId = (
      await import("@/lib/stores/auth-store")
    ).useAuthStore.getState().user?.id;
    if (!supplierId) {
      toast.error("Sesi habis, silakan login ulang");
      return;
    }

    const formData = new FormData();
    formData.append("supplier", supplierId);
    formData.append("wood_type", form.wood_type);
    formData.append("shape", form.shape);
    if (form.grade) formData.append("grade", form.grade);
    if (form.diameter) formData.append("diameter", String(form.diameter));
    if (form.length) formData.append("length", String(form.length));
    if (form.width) formData.append("width", String(form.width));
    if (form.height) formData.append("height", String(form.height));
    formData.append("volume", String(form.volume));
    formData.append("price", String(form.price));
    if (form.stock) formData.append("stock", String(form.stock));
    formData.append("unit", form.unit);
    formData.append("status", "available");
    if (form.description) formData.append("description", form.description);

    // Append each photo file
    for (const file of photos) {
      formData.append("photos", file);
    }

    // Append legality document if any
    for (const file of legalityDoc) {
      formData.append("legality_doc", file);
    }

    createMutation.mutate(formData, {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button variant="ghost" size="icon" asChild className="self-start">
          <Link href="/supplier/inventory">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Listing Baru
          </div>
          <h1 className="heading-2">Daftarkan Kayu Baru</h1>
          <p className="text-sm text-muted-foreground">
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
              <CardHeader className="-mt-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <TreePine className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg">Informasi Kayu</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
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
                      onValueChange={(v) => updateField("shape", v as TimberShape)}
                    >
                      <SelectTrigger
                        id="shape"
                        className={`w-full ${errors.shape ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Pilih bentuk kayu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="log">Log (Gelondongan)</SelectItem>
                        <SelectItem value="square">Square (Persegi)</SelectItem>
                        <SelectItem value="balok">Balok</SelectItem>
                        <SelectItem value="papan">Papan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.shape && (
                      <p className="text-xs text-destructive">
                        {errors.shape}
                      </p>
                    )}
                  </div>

                  {/* Grade */}
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label htmlFor="grade">Grade Kayu</Label>
                    <Select
                      value={form.grade}
                      onValueChange={(v) =>
                        updateField(
                          "grade",
                          v as "" | "perhutani" | "hutan_rakyat" | "lainnya",
                        )
                      }
                    >
                      <SelectTrigger id="grade" className="w-full">
                        <SelectValue placeholder="Pilih grade (opsional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perhutani">Perhutani</SelectItem>
                        <SelectItem value="hutan_rakyat">Hutan Rakyat</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            <Card>
              <CardHeader className="-mt-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Ruler className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg">Dimensi & Volume</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Dimensions — depends on shape */}
                {form.shape === "log" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="diameter">Diameter (cm)</Label>
                      <Input
                        id="diameter"
                        type="number"
                        placeholder="0"
                        value={form.diameter}
                        onChange={(e) => updateField("diameter", e.target.value)}
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
                ) : form.shape === "square" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Lebar/Sisi (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="0"
                        value={form.width}
                        onChange={(e) => updateField("width", e.target.value)}
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
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="width">Lebar (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="0"
                        value={form.width}
                        onChange={(e) => updateField("width", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Tebal (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="0"
                        value={form.height}
                        onChange={(e) => updateField("height", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Volume, Stock, Satuan */}
                <div className="grid grid-cols-3 gap-4">
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
                      <SelectTrigger id="unit" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m3">m³</SelectItem>
                        <SelectItem value="batang">Batang</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stok</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={form.stock}
                      onChange={(e) => updateField("stock", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price */}
            <Card>
              <CardHeader className="-mt-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg">Harga & Deskripsi</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Harga (Rp) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="price"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={priceDisplay}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className={`h-11 pl-10 ${errors.price ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-destructive">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Tambahkan deskripsi atau catatan (opsional)"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
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
              <CardHeader className="-mt-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg">
                    Foto Kayu <span className="text-destructive">*</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FileDropzone
                  maxFiles={5}
                  enableCamera
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
              <CardHeader className="-mt-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg">
                    Dokumen Legalitas
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FileDropzone
                  documentMode
                  accept=".pdf"
                  maxFiles={1}
                  onFilesChange={setLegalityDoc}
                />
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  Unggah SK Pengesahan atau sertifikat legal (PDF, maks 10MB)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky submit bar */}
        <div className="sticky bottom-0 -mx-4 mt-6 border-t bg-card/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
          <div className="flex items-center justify-between gap-3">
            <p className="hidden text-xs text-muted-foreground sm:block">
              <span className="text-destructive">*</span> Wajib diisi
            </p>
            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <Button variant="outline" type="button" asChild>
                <Link href="/supplier/inventory">Batal</Link>
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="gap-2 bg-gradient-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20"
              >
                <Save className="h-4 w-4" />
                {createMutation.isPending ? "Menyimpan..." : "Simpan Kayu"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
