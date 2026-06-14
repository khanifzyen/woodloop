"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getPB } from "@/lib/pocketbase/client";
import { useUpdateArticle, useDesignerArticles } from "@/lib/hooks/use-designer";
import type { ArticleCategory, DesignArticle } from "@/lib/pocketbase/types";

const categoryOptions: { value: ArticleCategory; label: string }[] = [
  { value: "dematerialization", label: "Dematerialisasi" },
  { value: "design_for_disassembly", label: "Desain untuk Dibongkar" },
  { value: "product_longevity", label: "Ketahanan Produk" },
  { value: "upcycling", label: "Upcycling" },
  { value: "general", label: "Umum" },
];

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const updateArticle = useUpdateArticle();
  const { data: articles } = useDesignerArticles();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("general");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const pb = getPB();
        const article = await pb.collection<DesignArticle>("design_articles").getOne(id);
        setTitle(article.title);
        setSlug(article.slug);
        setCategory(article.category);
        setExcerpt(article.excerpt || "");
        setContent(article.content);
        setPublished(article.published);
      } catch {
        toast.error("Gagal memuat artikel");
        router.push("/designer/articles");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Judul artikel harus diisi"); return; }
    if (!slug.trim()) { toast.error("Slug harus diisi"); return; }
    if (!content.trim()) { toast.error("Konten artikel harus diisi"); return; }

    updateArticle.mutate(
      { id, data: { title: title.trim(), slug: slug.trim(), category, excerpt: excerpt.trim() || undefined, content } },
      {
        onSuccess: () => {
          toast.success("Artikel berhasil diperbarui");
          router.push("/designer/articles");
        },
      },
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/designer/articles"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="heading-2">Edit Artikel</h1>
          <p className="text-muted-foreground mt-1">{title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle className="text-lg">Detail Artikel</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul <span className="text-destructive">*</span></Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ArticleCategory)}>
                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Textarea id="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Konten <span className="text-destructive">*</span></Label>
              <Textarea id="content" rows={15} value={content} onChange={(e) => setContent(e.target.value)} className="font-mono text-sm" />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant={published ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  updateArticle.mutate(
                    { id, data: { published: !published } },
                    { onSuccess: () => { setPublished(!published); toast.success(published ? "Artikel ditarik dari publikasi" : "Artikel dipublikasikan"); } },
                  );
                }}
                disabled={updateArticle.isPending}
              >
                {published ? "📢 Terbit" : "📝 Draf"}
              </Button>
              {published && (
                <span className="text-xs text-green-600">Artikel ini sudah terbit</span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/designer/articles">Batal</Link>
          </Button>
          <Button className="gap-2" type="submit" disabled={updateArticle.isPending}>
            <Save className="h-4 w-4" />
            {updateArticle.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
