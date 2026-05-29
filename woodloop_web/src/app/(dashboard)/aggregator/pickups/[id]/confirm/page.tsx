"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { usePickups, useUpdatePickupStatus } from "@/lib/hooks/use-aggregator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, MapPin, Scale, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { resizeImage } from "@/lib/resize-image";

export default function ConfirmPickupPage() {
  const router = useRouter();
  const params = useParams();
  const { data: pickupsData } = usePickups();
  const updateStatus = useUpdatePickupStatus();

  const pickup = pickupsData?.items?.find((p) => p.id === params.id);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function captureGPS() {
    setIsCapturingGPS(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsCapturingGPS(false);
          toast.success("Lokasi berhasil direkam");
        },
        () => {
          setIsCapturingGPS(false);
          toast.error("Gagal mendapatkan lokasi");
        }
      );
    } else {
      setIsCapturingGPS(false);
      toast.error("GPS tidak tersedia");
    }
  }

  async function handleSubmit() {
    if (!weight || Number(weight) <= 0) {
      toast.error("Weight harus diisi");
      return;
    }

    try {
      await updateStatus.mutateAsync({
        id: params.id as string,
        status: "completed",
        data: {
          weight_verified: Number(weight),
          notes: notes || undefined,
          pickup_photo: photoPreview ? [photoPreview] : undefined,
        },
      });
      toast.success("Pickup berhasil dikonfirmasi!");
      router.push("/aggregator/pickups");
    } catch {
      toast.error("Gagal mengkonfirmasi pickup");
    }
  }

  if (!pickup) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/aggregator/pickups">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Konfirmasi Pickup</h1>
          <p className="text-muted-foreground mt-1">
            Pickup #{params.id?.toString().slice(0, 8)}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Foto Bukti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          {photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Bukti pickup"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Ganti Foto
              </Button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Camera className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                Ambil Foto Bukti
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Lokasi Pickup
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gpsCoords ? (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">
                Lat: {gpsCoords.lat.toFixed(6)}, Lng: {gpsCoords.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={captureGPS}
              disabled={isCapturingGPS}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              {isCapturingGPS ? "Mendeteksi..." : "Rekam Lokasi Saat Ini"}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Berat Aktual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              placeholder="Catatan tambahan (opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href="/aggregator/pickups">Batal</Link>
        </Button>
        <Button
          className="gap-2"
          onClick={handleSubmit}
          disabled={updateStatus.isPending}
        >
          <CheckCircle className="h-4 w-4" />
          {updateStatus.isPending ? "Memproses..." : "Konfirmasi & Selesaikan"}
        </Button>
      </div>
    </div>
  );
}
