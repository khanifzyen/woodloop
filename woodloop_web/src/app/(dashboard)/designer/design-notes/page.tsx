"use client";

import { Plus, Palette } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDesignerNotes } from "@/lib/hooks/use-designer";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

const targetTypeLabels: Record<string, string> = {
  generator_product: "Produk Generator",
  converter_product: "Produk Converter",
};

export default function DesignerNotesPage() {
  const { data: notes, isLoading, isError, refetch } = useDesignerNotes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Catatan Desain</h1>
          <p className="text-muted-foreground mt-1">
            Beri saran desain pada produk Generator atau Converter
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/designer/design-notes/new">
            <Plus className="h-4 w-4" />
            Catatan Baru
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Memuat catatan desain...</p>
      ) : isError ? (
        <Card className="p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat catatan</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      ) : !notes || notes.length === 0 ? (
        <Card className="p-12 text-center">
          <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Belum ada catatan desain. Mulai beri saran pada produk!
          </p>
          <Button asChild>
            <Link href="/designer/design-notes/new">
              <Plus className="h-4 w-4 mr-2" />
              Buat Catatan
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {targetTypeLabels[note.target_type] || note.target_type}
                  </span>
                  {note.is_public ? (
                    <span className="text-xs text-green-600">Publik</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Privat</span>
                  )}
                </div>
                <p className="text-sm line-clamp-3">{note.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>{formatDate(note.created)}</span>
                  {note.sketch && note.sketch.length > 0 && (
                    <span>{note.sketch.length} sketsa</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
