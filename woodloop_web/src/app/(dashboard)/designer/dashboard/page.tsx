"use client";

import Link from "next/link";
import {
  BookOpen,
  Palette,
  Store,
  FileText,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCards } from "@/components/features/summary-cards";
import {
  useDesignerDashboard,
  type DesignerDashboardData,
} from "@/lib/hooks/use-designer";
import { formatDate } from "@/lib/utils";

export default function DesignerDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDesignerDashboard();

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-2">Dashboard Desainer</h1>
        </div>
        <Card className="p-8 text-center">
          <p className="text-destructive font-medium mb-2">
            Gagal memuat data dashboard
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || "Terjadi kesalahan koneksi ke server"}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  const summaryItems = [
    {
      title: "Total Artikel",
      value: data?.totalArticles ?? 0,
      icon: FileText,
    },
    {
      title: "Artikel Terbit",
      value: data?.publishedArticles ?? 0,
      icon: Eye,
    },
    {
      title: "Catatan Desain",
      value: data?.totalDesignNotes ?? 0,
      icon: MessageSquare,
    },
    {
      title: "Konsultasi Terbuka",
      value: data?.openConsultations ?? 0,
      icon: Store,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Dashboard Desainer</h1>
          <p className="text-muted-foreground mt-1">
            Kelola artikel sirkular, catatan desain, dan klinik desain Anda
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/designer/articles">
            <BookOpen className="h-4 w-4" />
            Tulis Artikel Baru
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <SummaryCards items={summaryItems} loading={isLoading} />

      {/* Recent Content + Quick Links */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Artikel Terbaru</CardTitle>
            {data && data.recentArticles.length > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/designer/articles">Lihat Semua</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data?.recentArticles.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada artikel. Mulai dengan menulis artikel sirkular!
              </p>
            ) : (
              <div className="space-y-3">
                {data?.recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {article.published ? "📢 Terbit" : "📝 Draf"} &middot;{" "}
                        {formatDate(article.created)}
                      </p>
                    </div>
                    <span className="text-xs capitalize ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {article.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Menu Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              asChild
            >
              <Link href="/designer/articles">
                <BookOpen className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Artikel Sirkular</p>
                  <p className="text-xs text-muted-foreground">
                    Tulis dan kelola artikel prinsip desain sirkular
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              asChild
            >
              <Link href="/designer/design-notes">
                <Palette className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Catatan Desain</p>
                  <p className="text-xs text-muted-foreground">
                    Beri saran desain pada produk Generator/Converter
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              asChild
            >
              <Link href="/designer/design-clinic">
                <Store className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Klinik Desain</p>
                  <p className="text-xs text-muted-foreground">
                    Marketplace jasa konsultasi desain
                  </p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
