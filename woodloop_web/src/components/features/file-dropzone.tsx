"use client";

import { useState, useRef, useCallback, type ChangeEvent } from "react";
import { Upload, X, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  onFilesChange: (files: File[]) => void;
  initialFiles?: string[];
  /** Jika true, render sebagai single file document upload */
  documentMode?: boolean;
  /** Tampilkan tombol kamera untuk capture langsung */
  enableCamera?: boolean;
  className?: string;
}

export function FileDropzone({
  accept = "image/*",
  maxFiles = 5,
  maxSizeMB = 5,
  onFilesChange,
  initialFiles,
  documentMode = false,
  className,
  enableCamera = false,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [existingPreviews, setExistingPreviews] = useState<string[]>(
    initialFiles ?? []
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const totalCount = files.length + existingPreviews.length;

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(newFiles);
      const remaining = maxFiles - totalCount;

      if (fileArray.length > remaining) {
        setError(`Maksimal ${maxFiles} file. Tersisa ${remaining} slot.`);
        return;
      }

      const oversized = fileArray.find((f) => f.size > maxSizeMB * 1024 * 1024);
      if (oversized) {
        setError(`File "${oversized.name}" terlalu besar (maks ${maxSizeMB}MB)`);
        return;
      }

      const updated = [...files, ...fileArray].slice(0, maxFiles);
      setFiles(updated);
      onFilesChange(updated);
    },
    [files, totalCount, maxFiles, maxSizeMB, onFilesChange]
  );

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  }

  function removeExisting(index: number) {
    const updated = existingPreviews.filter((_, i) => i !== index);
    setExistingPreviews(updated);
    onFilesChange(files); // parent handles the final list
  }

  // ── Document mode (single file) ──────────────────────────
  if (documentMode) {
    const hasFile = files.length > 0 || existingPreviews.length > 0;
    return (
      <div className={className}>
        {hasFile ? (
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
            <FileText className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              {files[0] && (
                <>
                  <p className="text-sm font-medium truncate">
                    {files[0].name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(files[0].size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </>
              )}
              {existingPreviews[0] && (
                <p className="text-sm text-muted-foreground">
                  Dokumen terunggah
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => {
                setFiles([]);
                setExistingPreviews([]);
                onFilesChange([]);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Upload dokumen legalitas (PDF)
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>
    );
  }

  // ── Image mode (multi-file) ──────────────────────────────
  return (
    <div className={cn("space-y-3", className)}>
      {/* Existing previews */}
      {existingPreviews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existingPreviews.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`Foto ${i + 1}`}
                className="h-20 w-20 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New file previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-20 w-20 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {totalCount < maxFiles && (
        <div>
          {useCamera ? (
            <div className="space-y-2">
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleInputChange}
              />
              <div className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Ambil foto menggunakan kamera
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => cameraRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Buka Kamera
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setUseCamera(false)}
              >
                Kembali ke upload file
              </Button>
            </div>
          ) : (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:bg-muted/50"
                )}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Seret foto ke sini atau klik untuk upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Maks {maxFiles} file, masing-masing {maxSizeMB}MB
                </p>
              </div>
              {enableCamera && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setUseCamera(true)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Ambil Foto dari Kamera
                </Button>
              )}
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {totalCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {totalCount} / {maxFiles} file
        </p>
      )}
    </div>
  );
}
