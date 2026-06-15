"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store, MessageCircle, User, Search, Plus,
  Clock, DollarSign, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDesignClinicDesigners, useClientConsultations, useCreateConsultation } from "@/lib/hooks/use-converter";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getFileUrl } from "@/lib/pocketbase/client";
import Image from "next/image";

const statusLabels: Record<string, string> = {
  open: "Terbuka",
  negotiation: "Negosiasi",
  in_progress: "Berjalan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const statusColors: Record<string, string> = {
  open: "text-green-600 bg-green-100",
  negotiation: "text-yellow-600 bg-yellow-100",
  in_progress: "text-blue-600 bg-blue-100",
  completed: "text-gray-600 bg-gray-100",
  cancelled: "text-red-600 bg-red-100",
};

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function DesignClinicClientPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  if (role !== "converter" && role !== "generator" && role !== "designer") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-12 text-center max-w-md">
          <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Fitur ini hanya tersedia untuk Converter, Generator, dan Designer.</p>
        </Card>
      </div>
    );
  }

  return <DesignClinicContent />;
}

function DesignClinicContent() {
  const [search, setSearch] = useState("");
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);
  const [consultTitle, setConsultTitle] = useState("");
  const [consultDesc, setConsultDesc] = useState("");
  const [consultBudget, setConsultBudget] = useState("");

  const { data: designers, isLoading: loadingDesigners } = useDesignClinicDesigners();
  const { data: myConsultations, isLoading: loadingConsultations } = useClientConsultations();
  const createConsultation = useCreateConsultation();

  const filtered = designers?.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.bio || "").toLowerCase().includes(q) ||
      (d.workshop_name || "").toLowerCase().includes(q)
    );
  });

  const handleCreate = async () => {
    if (!selectedDesigner || !consultTitle) return;
    await createConsultation.mutateAsync({
      designer: selectedDesigner,
      title: consultTitle,
      description: consultDesc,
      budget: consultBudget ? Number(consultBudget) : undefined,
    });
    setNewDialogOpen(false);
    setSelectedDesigner(null);
    setConsultTitle("");
    setConsultDesc("");
    setConsultBudget("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Klinik Desain</h1>
          <p className="text-muted-foreground mt-1">
            Konsultasi desain sirkular dengan para desainer profesional
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/design-clinic/recipes">
              Resep Desain
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari desainer..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Designers Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Desainer Tersedia
        </h2>
        {loadingDesigners ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : !filtered || filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {search ? "Tidak ada desainer yang cocok dengan pencarian." : "Belum ada desainer terdaftar."}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <Card key={d.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {d.avatar ? (
                        <Image
                          src={getFileUrl("users", d.id, d.avatar)}
                          alt={d.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback>{d.name.charAt(0).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{d.name}</p>
                      {d.workshop_name && (
                        <p className="text-xs text-muted-foreground truncate">{d.workshop_name}</p>
                      )}
                    </div>
                  </div>
                  {d.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{d.bio}</p>
                  )}
                  <Dialog open={newDialogOpen && selectedDesigner === d.id} onOpenChange={(open) => {
                    if (!open) { setNewDialogOpen(false); setSelectedDesigner(null); }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => { setSelectedDesigner(d.id); setNewDialogOpen(true); }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Hubungi
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajukan Konsultasi ke {d.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Judul Konsultasi</label>
                          <Input
                            placeholder="Contoh: Desain meja dari palet kayu"
                            value={consultTitle}
                            onChange={(e) => setConsultTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Deskripsi Kebutuhan</label>
                          <Textarea
                            placeholder="Jelaskan kebutuhan desain Anda..."
                            rows={4}
                            value={consultDesc}
                            onChange={(e) => setConsultDesc(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Anggaran (opsional)</label>
                          <Input
                            type="number"
                            placeholder="500000"
                            value={consultBudget}
                            onChange={(e) => setConsultBudget(e.target.value)}
                          />
                        </div>
                        <Button
                          className="w-full"
                          disabled={!consultTitle || createConsultation.isPending}
                          onClick={handleCreate}
                        >
                          {createConsultation.isPending ? "Mengirim..." : "Kirim Permintaan"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* My Consultations */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Konsultasi Saya
        </h2>
        {loadingConsultations ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : !myConsultations || myConsultations.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Belum ada konsultasi. Pilih desainer di atas untuk memulai.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {myConsultations.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${statusColors[c.status] || ""}`}>
                          {statusLabels[c.status] || c.status}
                        </span>
                      </div>
                      <h3 className="font-medium">{c.title}</h3>
                      {c.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {c.budget ? <span>{formatCurrency(c.budget)}</span> : null}
                        <span>{formatDate(c.created)}</span>
                        {c.expand?.designer && (
                          <span>Desainer: {c.expand.designer.name}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
