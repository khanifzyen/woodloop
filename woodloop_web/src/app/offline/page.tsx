"use client";

import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-sm">
        <WifiOff className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">Kamu Sedang Offline</h1>
        <p className="text-muted-foreground mb-6">
          WoodLoop membutuhkan koneksi internet. Coba periksa koneksi kamu dan coba lagi.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => window.location.reload()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
