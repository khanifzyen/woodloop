"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CameraCapture } from "@/components/features/camera-capture";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────
export type WasteFormType = "offcut_large" | "offcut_small" | "shaving" | "sawdust" | "logs_end";
export type WasteConditionType = "dry" | "wet" | "oiled" | "mixed";
export type WasteUnitType = "kg" | "m3" | "sack" | "pickup";

const WASTE_FORM_OPTIONS: { value: WasteFormType; label: string; icon: string }[] = [
  { value: "offcut_large", label: "Offcut Besar", icon: "🪵" },
  { value: "offcut_small", label: "Offcut Kecil", icon: "🔲" },
  { value: "shaving", label: "Serutan", icon: "🪮" },
  { value: "sawdust", label: "Serbuk Gergaji", icon: "🟤" },
  { value: "logs_end", label: "Potongan Kayu", icon: "🪓" },
];

const CONDITION_OPTIONS: { value: WasteConditionType; label: string }[] = [
  { value: "dry", label: "Kering" },
  { value: "wet", label: "Basah" },
  { value: "oiled", label: "Berminyak" },
  { value: "mixed", label: "Campuran" },
];

const UNIT_OPTIONS: { value: WasteUnitType; label: string }[] = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "m3", label: "Meter Kubik (m³)" },
  { value: "sack", label: "Karung" },
  { value: "pickup", label: "Pickup" },
];

// ── Stepper Data ───────────────────────────────────────
export interface WasteFormData {
  photos: string[];
  wood_type: string;
  form: WasteFormType;
  condition: WasteConditionType;
  volume: number;
  unit: WasteUnitType;
  price_estimate: number;
  description: string;
}

interface WasteFormStepperProps {
  woodTypes: { id: string; name: string }[];
  onSubmit: (data: WasteFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const STEPS = [
  { title: "Foto Limbah", description: "Ambil foto limbah kayu" },
  { title: "Jenis & Bentuk", description: "Pilih jenis dan bentuk limbah" },
  { title: "Volume & Harga", description: "Isi volume dan estimasi harga" },
  { title: "Konfirmasi", description: "Periksa data sebelum submit" },
];

export function WasteFormStepper({
  woodTypes,
  onSubmit,
  isSubmitting = false,
}: WasteFormStepperProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WasteFormData>({
    photos: [],
    wood_type: "",
    form: "offcut_large",
    condition: "dry",
    volume: 0,
    unit: "kg",
    price_estimate: 0,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = ((step + 1) / STEPS.length) * 100;

  function update<K extends keyof WasteFormData>(
    key: K,
    value: WasteFormData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validateStep(stepIndex: number): boolean {
    const errs: Record<string, string> = {};

    switch (stepIndex) {
      case 0:
        if (data.photos.length === 0)
          errs.photos = "Ambil minimal 1 foto limbah";
        break;
      case 1:
        if (!data.wood_type) errs.wood_type = "Pilih jenis kayu";
        break;
      case 2:
        if (data.volume <= 0) errs.volume = "Volume harus lebih dari 0";
        if (data.price_estimate < 0)
          errs.price_estimate = "Harga tidak valid";
        break;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  }

  function handlePrev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    onSubmit(data);
  }

  // ── Render Step 0: Photo ────────────────────────────
  function renderStep0() {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Ambil foto limbah kayu yang ingin Anda setor. Pastikan pencahayaan
          cukup dan limbah terlihat jelas.
        </p>
        <CameraCapture
          onCapture={(dataUrl) =>
            update("photos", [dataUrl, ...data.photos].slice(0, 5))
          }
          onRemove={() => update("photos", [])}
        />
        {data.photos.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {data.photos.slice(1).map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt={`Foto ${i + 2}`}
                  className="h-16 w-16 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = data.photos.filter((_, idx) => idx !== i + 1);
                    update("photos", updated);
                  }}
                  className="absolute -top-1 -right-1 bg-destructive text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.photos && (
          <p className="text-xs text-destructive">{errors.photos}</p>
        )}
      </div>
    );
  }

  // ── Render Step 1: Type ──────────────────────────────
  function renderStep1() {
    return (
      <div className="space-y-6">
        {/* Wood Type */}
        <div className="space-y-2">
          <Label htmlFor="wood_type">
            Jenis Kayu <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.wood_type}
            onValueChange={(v) => update("wood_type", v)}
          >
            <SelectTrigger
              id="wood_type"
              className={errors.wood_type ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Pilih jenis kayu" />
            </SelectTrigger>
            <SelectContent>
              {woodTypes.map((wt) => (
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

        {/* Form shape */}
        <div className="space-y-2">
          <Label>Bentuk Limbah</Label>
          <div className="grid grid-cols-2 gap-2">
            {WASTE_FORM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("form", opt.value)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors",
                  data.form === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input hover:bg-muted"
                )}
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label>Kondisi</Label>
          <Select
            value={data.condition}
            onValueChange={(v) => update("condition", v as WasteConditionType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // ── Render Step 2: Volume ────────────────────────────
  function renderStep2() {
    return (
      <div className="space-y-6">
        {/* Volume */}
        <div className="space-y-2">
          <Label htmlFor="volume">
            Volume <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="volume"
                type="number"
                step="0.1"
                placeholder="0"
                value={data.volume || ""}
                onChange={(e) => update("volume", Number(e.target.value))}
                className={errors.volume ? "border-destructive" : ""}
              />
              {errors.volume && (
                <p className="text-xs text-destructive mt-1">
                  {errors.volume}
                </p>
              )}
            </div>
            <Select
              value={data.unit}
              onValueChange={(v) => update("unit", v as WasteUnitType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Estimate */}
        <div className="space-y-2">
          <Label htmlFor="price_estimate">
            Estimasi Harga (Rp)
          </Label>
          <Input
            id="price_estimate"
            type="number"
            placeholder="0 (Kosongi jika gratis)"
            value={data.price_estimate || ""}
            onChange={(e) =>
              update("price_estimate", Number(e.target.value))
            }
          />
          <p className="text-xs text-muted-foreground">
            Biarkan 0 jika ingin memberikan limbah secara gratis
          </p>
          {errors.price_estimate && (
            <p className="text-xs text-destructive">
              {errors.price_estimate}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            placeholder="Deskripsi tambahan (jenis kayu, kondisi, dll)"
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
          />
        </div>
      </div>
    );
  }

  // ── Render Step 3: Confirmation ───────────────────────
  function renderStep3() {
    const selectedWood = woodTypes.find(
      (wt) => wt.id === data.wood_type
    );
    const selectedForm = WASTE_FORM_OPTIONS.find(
      (f) => f.value === data.form
    );
    const selectedCondition = CONDITION_OPTIONS.find(
      (c) => c.value === data.condition
    );
    const selectedUnit = UNIT_OPTIONS.find(
      (u) => u.value === data.unit
    );

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Periksa data limbah Anda sebelum mengirimkan.
        </p>

        {/* Photo preview */}
        {data.photos[0] && (
          <img
            src={data.photos[0]}
            alt="Preview limbah"
            className="w-full h-40 object-cover rounded-lg border"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Jenis Kayu</p>
            <p className="font-medium">{selectedWood?.name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bentuk</p>
            <p className="font-medium">
              {selectedForm?.icon} {selectedForm?.label}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Kondisi</p>
            <Badge variant="outline" className="mt-0.5">
              {selectedCondition?.label}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="font-medium">
              {data.volume} {selectedUnit?.label}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Estimasi Harga
            </p>
            <p className="font-medium">
              {data.price_estimate > 0
                ? `Rp ${data.price_estimate.toLocaleString("id-ID")}`
                : "Gratis"}
            </p>
          </div>
        </div>

        {data.description && (
          <div>
            <p className="text-xs text-muted-foreground">Deskripsi</p>
            <p className="text-sm">{data.description}</p>
          </div>
        )}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────
  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3];

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{STEPS[step].title}</span>
          <span className="text-muted-foreground">
            Langkah {step + 1} dari {STEPS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {STEPS[step].description}
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (i < step) setStep(i);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium transition-colors",
              i < step && "bg-primary text-primary-foreground cursor-pointer",
              i === step && "bg-primary/20 text-primary border border-primary",
              i > step && "bg-muted text-muted-foreground"
            )}
            disabled={i > step}
          >
            {i < step ? <Check className="h-4 w-4" /> : i + 1}
          </button>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="pt-6">
          {stepRenderers[step]()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrev}
          disabled={step === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={handleNext} className="gap-2">
            Lanjut
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Mengirim..." : "Setor Limbah"}
          </Button>
        )}
      </div>
    </div>
  );
}
