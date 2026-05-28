"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Scan, Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();
  const [manualId, setManualId] = useState("");

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualId.trim()) {
      router.push(`/p/${manualId.trim()}`);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/buyer/marketplace"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div><h1 className="heading-2">Scan QR</h1><p className="text-muted-foreground">Pindai QR code produk</p></div>
      </div>

      <Card>
        <CardContent className="pt-8 pb-8 text-center">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 mb-4">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Arahkan kamera ke QR code produk
            </p>
            <p className="text-xs text-muted-foreground">
              Atau gunakan input manual di bawah
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <Input
          placeholder="Masukkan kode QR..."
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
        />
        <Button type="submit" className="gap-2">
          <Scan className="h-4 w-4" /> Cari
        </Button>
      </form>
    </div>
  );
}
