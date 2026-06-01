"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { getPB, getFileUrl } from "@/lib/pocketbase/client";
import { useWoodTypes } from "@/lib/hooks/use-generator";
import type {
  WasteListing,
  WasteForm,
  WasteCondition,
  WasteUnit,
  WoodType,
} from "@/lib/pocketbase/types";

interface WasteWithExpand extends WasteListing {
  expand?: { wood_type?: WoodType };
}

const formOptions: { value: WasteForm; label: string }[] = [
  { value: "offcut_large", label: "Offcut Besar" },
  { value: "offcut_small", label: "Offcut Kecil" },
  { value: "shaving", label: "Serutan" },
  { value: "sawdust", label: "Serbuk Gergaji" },
  { value: "logs_end", label: "Potongan Kayu" },
];

const conditionOptions: { value: WasteCondition; label: string }[] = [
  { value: "dry", label: "Kering" },
  { value: "wet", label: "Basah" },
  { value: "oiled", label: "Berminyak" },
  { value: "mixed", label: "Campuran" },
];

const unitOptions: { value: WasteUnit; label: string }[] = [
  { value: "kg", label: "kg" },
  { value: "m3", label: "m³" },
  { value: "sack", label: "Karung" },
  { value: "pickup", label: "Pickup" },
];

export default function EditWasteListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: woodTypes } = useWoodTypes();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<WasteWithExpand | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    wood_type: "",
    form: "offcut_large" as WasteForm,
    condition: "dry" as WasteCondition,
    volume: "",
    unit: "kg" as WasteUnit,
    price_estimate: "",
    description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const pb = getPB();
        const record = (await pb
          .collection("waste_listings")
          .getOne(id, { expand: "wood_type", requestKey: null })) as WasteWithExpand;
        setListing(record);

        const photoUrls = (record.photos || []).map((p: string) =>
          getFileUrl("waste_listings", record.id, p)
        );
        setExistingPhotos(photoUrls);

        setForm({
          wood_type: record.wood_type || "",
          form: record.form || "offcut_large",
          condition: record.condition || "dry",
          volume: record.volume?.toString() || "",
          unit: record.unit || "kg",
          price_estimate: record.price_estimate?.toString() || "",
          description: record.description || "",
        });
      } catch {
        toast.error("Gagal memuat data limbah");
        router.push("/generator/waste");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.wood_type) errs.wood_type = "Pilih jenis kayu";
    if (!form.volume || Number(form.volume) <= 0) errs.volume = "Volume harus diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("wood_type", form.wood_type);
    fd.append("form", form.form);
    fd.append("condition", form.condition);
    fd.append("volume", form.volume);
    fd.append("unit", form.unit);
    fd.append("price_estimate", form.price_estimate || "0");
    if (form.description) fd.append("description", form.description);
    for (const file of photos) {
      fd.append("photos", file);
    }

    try {
      const pb = getPB();
      await pb.collection("waste_listings").update(id, fd);
      toast.success("Limbah berhasil diperbarui!");
      router.push("/generator/waste");
    } catch (err) {
      toast.error("Gagal memperbarui: " + (err instanceof Error ? err.message : "Unknown error"));
    }
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

  if (!listing) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/generator/waste">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Edit Limbah</h1>
          <p className="text-muted-foreground mt-1">
            Perbarui informasi limbah kayu
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Limbah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Wood Type */}
            <div className="space-y-2">
              <Label htmlFor="wood_type">
                Jenis Kayu <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.wood_type}
                onValueChange={(v) => updateField("wood_type", v)}
              >
                <SelectTrigger id="wood_type" className={errors.wood_type ? "border-destructive" : ""}>
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
              {errors.wood_type && (
                <p className="text-xs text-destructive">{errors.wood_type}</p>
              )}
            </div>

            {/* Form & Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="form">Bentuk</Label>
                <Select
                  value={form.form}
                  onValueChange={(v) => updateField("form", v as WasteForm)}
                >
                  <SelectTrigger id="form">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Kondisi</Label>
                <Select
                  value={form.condition}
                  onValueChange={(v) => updateField("condition", v as WasteCondition)}
                >
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  step="0.001"
                  placeholder="0"
                  value={form.volume}
                  onChange={(e) => updateField("volume", e.target.value)}
                  className={errors.volume ? "border-destructive" : ""}
                />
                {errors.volume && (
                  <p className="text-xs text-destructive">{errors.volume}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Satuan</Label>
                <Select
                  value={form.unit}
                  onValueChange={(v) => updateField("unit", v as WasteUnit)}
                >
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Estimate */}
            <div className="space-y-2">
              <Label htmlFor="price_estimate">Estimasi Harga (Rp)</Label>
              <Input
                id="price_estimate"
                type="number"
                placeholder="0"
                value={form.price_estimate}
                onChange={(e) => updateField("price_estimate", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Kosongi jika gratis</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Deskripsi tambahan (opsional)"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Foto</CardTitle>
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

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" type="button" asChild>
            <Link href="/generator/waste">Batal</Link>
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
