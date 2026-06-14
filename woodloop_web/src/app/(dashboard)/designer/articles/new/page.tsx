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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreateArticle } from "@/lib/hooks/use-designer";
import type { ArticleCategory } from "@/lib/pocketbase/types";

const categoryOptions: { value: ArticleCategory; label: string }[] = [
  { value: "dematerialization", label: "Dematerialisasi" },
  { value: "design_for_disassembly", label: "Desain untuk Dibongkar" },
  { value: "product_longevity", label: "Ketahanan Produk" },
  { value: "upcycling", label: "Upcycling" },
  { value: "general", label: "Umum" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();
  const createArticle = useCreateArticle();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("general");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (autoSlug) setSlug(slugify(value));
  }

  function handleAutoSlugToggle() {
    setAutoSlug(!autoSlug);
    if (autoSlug) setSlug(slugify(title));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Judul artikel harus diisi"); return; }
    if (!slug.trim()) { toast.error("Slug harus diisi"); return; }
    if (!content.trim()) { toast.error("Konten artikel harus diisi"); return; }

    createArticle.mutate(
      {
        title: title.trim(),
        slug: slug.trim(),
        category,
        excerpt: excerpt.trim() || undefined,
        content,
        published: false,
      },
      {
        onSuccess: () => {
          toast.success("Artikel berhasil dibuat");
          router.push("/designer/articles");
        },
      },
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/designer/articles"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="heading-2">Artikel Baru</h1>
          <p className="text-muted-foreground mt-1">Tulis artikel tentang prinsip desain sirkular</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle className="text-lg">Detail Artikel</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul <span className="text-destructive">*</span></Label>
              <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Masukkan judul artikel" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
                <button type="button" className="text-xs text-primary hover:underline" onClick={handleAutoSlugToggle}>
                  {autoSlug ? "Edit manual" : "Auto dari judul"}
                </button>
              </div>
              <Input id="slug" value={slug} onChange={(e) => { setAutoSlug(false); setSlug(e.target.value); }} placeholder="judul-artikel" />
              <p className="text-xs text-muted-foreground">Digunakan di URL: /designer/articles/{slug || "..."}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori <span className="text-destructive">*</span></Label>
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
              <Textarea id="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Ringkasan singkat artikel (opsional)" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Konten <span className="text-destructive">*</span></Label>
              <Textarea id="content" rows={15} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis konten artikel di sini... (Markdown / HTML)" className="font-mono text-sm" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/designer/articles">Batal</Link>
          </Button>
          <Button className="gap-2" type="submit" disabled={createArticle.isPending}>
            <Save className="h-4 w-4" />
            {createArticle.isPending ? "Menyimpan..." : "Simpan sebagai Draf"}
          </Button>
        </div>
      </form>
    </div>
  );
}
