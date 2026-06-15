"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileDropzone } from "@/components/features/file-dropzone";
import { useCreateDesignNote } from "@/lib/hooks/use-designer";
import { getPB } from "@/lib/pocketbase/client";
import { useQuery } from "@tanstack/react-query";
import type { GeneratorProduct, Product } from "@/lib/pocketbase/types";

export default function NewDesignNotePage() {
  const router = useRouter();
  const createNote = useCreateDesignNote();

  const [targetType, setTargetType] = useState<"generator_product" | "converter_product">("generator_product");
  const [targetId, setTargetId] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [sketchFiles, setSketchFiles] = useState<File[]>([]);

  // Fetch products for the selected target type
  const collectionName = targetType === "generator_product" ? "generator_products" : "products";
  const { data: targetProducts } = useQuery({
    queryKey: ["design-notes", "targets", targetType],
    queryFn: async () => {
      const pb = getPB();
      const result = await pb.collection(collectionName).getList(1, 200, {
        sort: "-id",
        fields: "id,name",
      });
      return result.items as unknown as { id: string; name: string }[];
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!targetId) { toast.error("Pilih produk target"); return; }
    if (!content.trim()) { toast.error("Konten catatan harus diisi"); return; }

    const formData = new FormData();
    formData.append("target_type", targetType);
    formData.append("target_id", targetId);
    formData.append("content", content.trim());
    formData.append("is_public", String(isPublic));
    for (const file of sketchFiles) {
      formData.append("sketch", file);
    }

    createNote.mutate(formData, {
      onSuccess: () => {
        toast.success("Catatan desain berhasil dibuat");
        router.push("/designer/design-notes");
      },
    });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/designer/design-notes"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="heading-2">Catatan Desain Baru</h1>
          <p className="text-muted-foreground mt-1">Beri saran desain pada produk Generator atau Converter</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle className="text-lg">Detail Catatan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetType">Target Produk <span className="text-destructive">*</span></Label>
              <Select value={targetType} onValueChange={(v) => { setTargetType(v as typeof targetType); setTargetId(""); }}>
                <SelectTrigger id="targetType"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="generator_product">Produk Generator</SelectItem>
                  <SelectItem value="converter_product">Produk Converter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetId">Pilih Produk <span className="text-destructive">*</span></Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger id="targetId"><SelectValue placeholder="Pilih produk..." /></SelectTrigger>
                <SelectContent>
                  {targetProducts?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Catatan Desain <span className="text-destructive">*</span></Label>
              <Textarea
                id="content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis saran desain, ide pengembangan, atau catatan untuk produk ini..."
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Sketsa Pendukung</Label>
              <FileDropzone
                maxFiles={3}
                maxSizeMB={5}
                onFilesChange={setSketchFiles}
              />
              <p className="text-xs text-muted-foreground">Maks 3 file sketsa. Format JPG, PNG, atau WebP. Maks 5 MB per file.</p>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="font-medium">Catatan Publik</Label>
                <p className="text-xs text-muted-foreground">Jika aktif, produk target bisa melihat catatan ini</p>
              </div>
              <Button
                type="button"
                variant={isPublic ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setIsPublic(!isPublic)}
              >
                {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {isPublic ? "Publik" : "Privat"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/designer/design-notes">Batal</Link>
          </Button>
          <Button className="gap-2" type="submit" disabled={createNote.isPending}>
            <Save className="h-4 w-4" />
            {createNote.isPending ? "Menyimpan..." : "Simpan Catatan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
