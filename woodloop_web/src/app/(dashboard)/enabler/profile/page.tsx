"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUpdateProfile } from "@/lib/hooks/use-update-profile";

export default function EnablerProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  async function handleSave() {
    updateProfile.mutate({ name, phone, address });
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/enabler/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="heading-2">Profil Saya</h1>
          <p className="text-muted-foreground mt-1">Kelola data diri Anda</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Informasi Akun</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nama <span className="text-destructive">*</span></Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telepon</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea id="address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild><Link href="/enabler/dashboard">Batal</Link></Button>
        <Button className="gap-2" onClick={handleSave} disabled={updateProfile.isPending}>
          <Save className="h-4 w-4" />{updateProfile.isPending ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </div>
    </div>
  );
}
