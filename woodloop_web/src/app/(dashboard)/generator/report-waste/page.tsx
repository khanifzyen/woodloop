"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  WasteFormStepper,
  type WasteFormData,
} from "@/components/features/waste-form-stepper";
import {
  useWoodTypes,
  useCreateWasteListing,
} from "@/lib/hooks/use-generator";
import { getPB } from "@/lib/pocketbase/client";
import Link from "next/link";

export default function ReportWastePage() {
  const router = useRouter();
  const { data: woodTypes, isLoading } = useWoodTypes();
  const createMutation = useCreateWasteListing();

  async function handleSubmit(formData: WasteFormData) {
    // Upload photos first
    const pb = getPB();
    let photoUrls: string[] = [];

    try {
      for (const dataUrl of formData.photos) {
        // Convert dataUrl to Blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], `waste-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        // Upload via PocketBase
        const form = new FormData();
        form.append("file", file);
        const uploadResult = await pb.collection("waste_listings").create(
          {
            generator: "",
            wood_type: formData.wood_type,
            form: formData.form,
            condition: formData.condition,
            volume: formData.volume,
            unit: formData.unit,
            price_estimate: formData.price_estimate,
            status: "available",
          },
          { photos: [file] }
        );
        photoUrls = uploadResult.photos || [];
        // Clean up temp record
        await pb.collection("waste_listings").delete(uploadResult.id);
        break;
      }
    } catch {
      // Silently fail upload, will try direct create
    }

    createMutation.mutate(
      {
        wood_type: formData.wood_type,
        form: formData.form,
        condition: formData.condition,
        volume: formData.volume,
        unit: formData.unit,
        photos: photoUrls,
        price_estimate: formData.price_estimate,
        description: formData.description || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Limbah berhasil disetor!");
          router.push("/generator/dashboard");
        },
        onError: (err) => {
          toast.error("Gagal menyetor limbah: " + err.message);
        },
      }
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/generator/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Setor Limbah</h1>
          <p className="text-muted-foreground mt-1">
            Laporkan limbah kayu Anda untuk dijual ke Aggregator
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : (
        <WasteFormStepper
          woodTypes={woodTypes || []}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
}
