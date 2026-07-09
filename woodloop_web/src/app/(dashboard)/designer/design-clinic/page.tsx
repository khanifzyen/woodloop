"use client";

import { Store, MessageCircle, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDesignerConsultations } from "@/lib/hooks/use-designer";
import { formatDate } from "@/lib/utils";

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

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

const typeLabels: Record<string, string> = {
  client_request: "Permintaan Klien",
  designer_offer: "Penawaran Desainer",
};

export default function DesignClinicPage() {
  const { data: consultations, isLoading, isError, refetch } = useDesignerConsultations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Klinik Desain</h1>
          <p className="text-muted-foreground mt-1">
            Marketplace jasa konsultasi desain sirkular
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/designer/design-clinic/recipes">
              Resep Desain
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{consultations?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-2xl font-bold">
              {consultations?.filter((c) => c.status === "open").length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Terbuka</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-2xl font-bold">
              {consultations?.filter((c) => c.status === "in_progress").length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Berjalan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Store className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">
              {consultations?.filter((c) => c.status === "completed").length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Selesai</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Memuat konsultasi...</p>
      ) : isError ? (
        <Card className="p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat data</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      ) : !consultations || consultations.length === 0 ? (
        <Card className="p-12 text-center">
          <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Belum ada konsultasi. Tunggu permintaan dari Generator/Converter
            atau buat penawaran jasa desain Anda.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${statusColors[c.status]}`}
                      >
                        {statusLabels[c.status] || c.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {typeLabels[c.type] || c.type}
                      </span>
                    </div>
                    <h3 className="font-medium">{c.title}</h3>
                    {c.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {c.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {c.budget && <span>{formatCurrency(c.budget)}</span>}
                      <span>{formatDate(c.created)}</span>
                      {c.expand?.client && (
                        <span>Klien: {c.expand.client.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
