"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, MapPin, Loader2, Trash2, FileText } from "lucide-react";
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
      { doc_type: newDocType, doc_name: newDocName || undefined, file: newDocFile },
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/supplier/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Profil Supplier</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data diri dan dokumen perizinan
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left — Informasi Supplier */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Supplier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama <span className="text-destructive">*</span></Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workshop">Nama Workshop</Label>
                <Input id="workshop" value={workshop} onChange={(e) => setWorkshop(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Lokasi (GPS)</Label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">
                    Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
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
                <MapPicker lat={lat} lng={lng} onMove={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }} />
                <p className="text-xs text-muted-foreground mt-1">
                  Klik atau drag marker untuk mengatur lokasi workshop Anda
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" asChild>
              <Link href="/supplier/dashboard">Batal</Link>
            </Button>
            <Button className="gap-2" onClick={handleSaveProfile} disabled={updateProfile.isPending}>
              <Save className="h-4 w-4" />
              {updateProfile.isPending ? "Menyimpan..." : "Simpan Profil"}
            </Button>
          </div>
        </div>

        {/* Right — Dokumen Perizinan */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dokumen Perizinan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {docsLoading ? (
                <p className="text-sm text-muted-foreground">Memuat dokumen...</p>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {doc.doc_name || DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                            {doc.verified && (
                              <span className="ml-2 text-green-600">✓ Terverifikasi</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
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
                <p className="text-sm text-muted-foreground">
                  Belum ada dokumen. Unggah dokumen perizinan Anda di bawah.
                </p>
              )}

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium">Tambah Dokumen Baru</p>

                <div className="space-y-2">
                  <Label htmlFor="doc_type">Jenis Dokumen</Label>
                  <Select value={newDocType} onValueChange={(v) => setNewDocType(v as DocType)}>
                    <SelectTrigger id="doc_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DOC_TYPE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
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
                    onChange={(e) => setNewDocFile(e.target.files?.[0] || null)}
                  />
                </div>

                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={handleUploadDoc}
                  disabled={uploadDoc.isPending || !newDocFile}
                >
                  {uploadDoc.isPending ? "Mengunggah..." : "Upload Dokumen"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
