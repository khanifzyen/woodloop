"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Camera, Upload, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onRemove?: () => void;
  previewUrl?: string | null;
  className?: string;
}

export function CameraCapture({
  onCapture,
  onRemove,
  previewUrl: externalPreview,
  className,
}: CameraCaptureProps) {
  const [internalPreview, setInternalPreview] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preview = externalPreview ?? internalPreview;

  /** Attempt to use native Capacitor camera, fall back to file input */
  async function handleCameraClick() {
    // Try Capacitor first
    try {
      const { Capacitor } = await import("@capacitor/core");
      if (Capacitor.isPluginAvailable("Camera")) {
        setIsDetecting(true);
        const { Camera: CapCamera, CameraResultType, CameraSource } =
          await import("@capacitor/camera");

        const image = await CapCamera.getPhoto({
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          quality: 80,
        });

        if (image.dataUrl) {
          setInternalPreview(image.dataUrl);
          onCapture(image.dataUrl);
        }
        return;
      }
    } catch {
      // Capacitor not available, fall through to web
    }

    // Web fallback: open file picker with camera capture
    fileInputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setInternalPreview(dataUrl);
      onCapture(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRemove() {
    setInternalPreview(null);
    onRemove?.();
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Hidden file input (web fallback) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleCameraClick}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleCameraClick}
          className={cn(
            "flex flex-col items-center justify-center gap-3 p-8",
            "border-2 border-dashed rounded-lg cursor-pointer",
            "transition-colors hover:bg-muted/50",
            isDetecting ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          )}
        >
          {isDetecting ? (
            <>
              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-primary">
                Membuka kamera...
              </p>
            </>
          ) : (
            <>
              <Camera className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                Ambil Foto Limbah
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Gunakan kamera untuk memotong limbah kayu Anda
                <br />
                <span className="italic">Atau klik untuk upload dari galeri</span>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
