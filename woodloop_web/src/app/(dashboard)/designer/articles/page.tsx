"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useDesignerArticles,
  useDeleteArticle,
  useUpdateArticle,
} from "@/lib/hooks/use-designer";
import type { ArticleCategory } from "@/lib/pocketbase/types";

const categoryLabels: Record<ArticleCategory, string> = {
  dematerialization: "Dematerialisasi",
  design_for_disassembly: "Desain untuk Dibongkar",
  product_longevity: "Ketahanan Produk",
  upcycling: "Upcycling",
  general: "Umum",
};

export default function DesignerArticlesPage() {
  const { data: articles, isLoading, isError, refetch } = useDesignerArticles();
  const deleteArticle = useDeleteArticle();
  const updateArticle = useUpdateArticle();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleTogglePublish = (id: string, current: boolean) => {
    const formData = new FormData();
    formData.append("published", String(!current));
    updateArticle.mutate({ id, formData });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteArticle.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-2">Artikel Sirkular</h1>
          <p className="text-muted-foreground mt-1">
            Tulis dan kelola artikel tentang prinsip desain sirkular
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/designer/articles/new">
            <Plus className="h-4 w-4" />
            Artikel Baru
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Memuat artikel...</p>
      ) : isError ? (
        <Card className="p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat artikel</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Card>
      ) : !articles || articles.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Belum ada artikel. Mulai tulis artikel sirkular pertama Anda!
          </p>
          <Button asChild>
            <Link href="/designer/articles/new">
              <Plus className="h-4 w-4 mr-2" />
              Tulis Artikel
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs capitalize px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {categoryLabels[article.category] || article.category}
                      </span>
                      {article.published ? (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                          Terbit
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          Draf
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium truncate">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePublish(article.id, article.published)}
                      title={article.published ? "Tarik dari publikasi" : "Publikasikan"}
                    >
                      {article.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/designer/articles/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(article.id)}
                      disabled={deletingId === article.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
