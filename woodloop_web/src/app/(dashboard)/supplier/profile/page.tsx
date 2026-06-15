"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  MapPin,
  Loader2,
  Trash2,
  FileText,
  User,
  Building2,
  Phone,
  Home,
  ShieldCheck,
  Plus,
  UserCircle,
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUpdateProfile } from "@/lib/hooks/use-update-profile";
import {
  useUserDocuments,
  useUploadUserDocument,
  useDeleteUserDocument,
} from "@/lib/hooks/use-user-documents";
import type { DocType } from "@/lib/pocketbase/types";

const MapPicker = dynamic(() => import("@/components/features/map-picker"), {
  ssr: false,
});

const DOC_TYPE_LABELS: Record<string, string> = {
  NIB: "NIB",
  SVLK: "SVLK",
  SK_Pengesahan: "SK Pengesahan",
  Izin_Usaha: "Izin Usaha",
  Sertifikat_Lainnya: "Sertifikat Lainnya",
  Lainnya: "Lainnya",
};

export default function SupplierProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const uploadDoc = useUploadUserDocument();
  const deleteDoc = useDeleteUserDocument();
  const { data: documents, isLoading: docsLoading } = useUserDocuments();

  const [name, setName] = useState(user?.name || "");
  const [workshop, setWorkshop] = useState(user?.workshop_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [lat, setLat] = useState(user?.location_lat || -6.5891);
  const [lng, setLng] = useState(user?.location_lng || 110.6705);
  const [newDocType, setNewDocType] = useState<DocType>("NIB");
  const [newDocName, setNewDocName] = useState("");
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gettingLocation, setGettingLocation] = useState(false);

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolokasi tidak didukung browser Anda");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setGettingLocation(false);
        toast.success("Lokasi terdeteksi");
      },
      () => {
        setGettingLocation(false);
        toast.error("Gagal mendapatkan lokasi. Periksa izin GPS.");
      },
    );
  }

  async function handleSaveProfile() {
    updateProfile.mutate({
      name,
      workshop_name: workshop,
      phone,
      address,
      location_lat: lat,
      location_lng: lng,
    });
  }

  async function handleUploadDoc() {
    if (!newDocFile) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }
    uploadDoc.mutate(
      {
        doc_type: newDocType,
        doc_name: newDocName || undefined,
        file: newDocFile,
      },
      {
        onSuccess: () => {
          setNewDocFile(null);
          setNewDocName("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          toast.success("Dokumen berhasil diupload");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button variant="ghost" size="icon" asChild className="self-start">
          <Link href="/supplier/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <UserCircle className="h-3.5 w-3.5" />
            Profil Saya
          </div>
          <h1 className="heading-2">Profil Supplier</h1>
          <p className="text-sm text-muted-foreground">
            Kelola data diri dan dokumen perizinan
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left — Informasi Supplier */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="-mt-4 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Informasi Supplier</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workshop">Nama Workshop</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="workshop"
                    value={workshop}
                    onChange={(e) => setWorkshop(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <div className="relative">
                  <Home className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lokasi */}
          <Card>
            <CardHeader className="-mt-4 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Lokasi Workshop</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="font-mono text-muted-foreground">
                  Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto gap-1"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  {gettingLocation ? "Mendeteksi..." : "Pakai Lokasi Saya"}
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border">
                <MapPicker
                  lat={lat}
                  lng={lng}
                  onMove={(newLat, newLng) => {
                    setLat(newLat);
                    setLng(newLng);
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Klik atau drag marker untuk mengatur lokasi workshop Anda
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" asChild>
              <Link href="/supplier/dashboard">Batal</Link>
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20"
              onClick={handleSaveProfile}
              disabled={updateProfile.isPending}
            >
              <Save className="h-4 w-4" />
              {updateProfile.isPending ? "Menyimpan..." : "Simpan Profil"}
            </Button>
          </div>
        </div>

        {/* Right — Dokumen Perizinan */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="-mt-4 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Dokumen Perizinan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {docsLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-14 w-full animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {doc.doc_name ||
                              DOC_TYPE_LABELS[doc.doc_type] ||
                              doc.doc_type}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]">
                              {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                            </Badge>
                            {doc.verified && (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Terverifikasi
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          asChild
                        >
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm("Hapus dokumen ini?")) {
                              deleteDoc.mutate(doc.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-8 text-center">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Belum ada dokumen
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Unggah dokumen perizinan Anda di bawah
                  </p>
                </div>
              )}

              <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Tambah Dokumen Baru</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc_type">Jenis Dokumen</Label>
                  <Select
                    value={newDocType}
                    onValueChange={(v) => setNewDocType(v as DocType)}
                  >
                    <SelectTrigger id="doc_type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DOC_TYPE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc_name">Nama Dokumen (opsional)</Label>
                  <Input
                    id="doc_name"
                    placeholder="Contoh: SK Pengesahan 2026"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc_file">File (PDF, maks 10MB)</Label>
                  <Input
                    ref={fileInputRef}
                    id="doc_file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) =>
                      setNewDocFile(e.target.files?.[0] || null)
                    }
                  />
                </div>

                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={handleUploadDoc}
                  disabled={uploadDoc.isPending || !newDocFile}
                >
                  {uploadDoc.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Upload Dokumen
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
