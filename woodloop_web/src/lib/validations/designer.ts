import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Design Articles
// ---------------------------------------------------------------------------
export const articleCategoryEnum = z.enum([
  "dematerialization", "design_for_disassembly", "product_longevity", "upcycling", "general",
]);

export const articleSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200, "Maksimal 200 karakter"),
  slug: z.string().min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  content: z.string().min(1, "Konten wajib diisi"),
  excerpt: z.string().max(300, "Maksimal 300 karakter").optional(),
  cover_image: z.string().optional(),
  category: articleCategoryEnum,
  published: z.boolean().default(false),
  tags: z.string().max(500).optional(),
});
export type ArticleFormData = z.infer<typeof articleSchema>;

// ---------------------------------------------------------------------------
// Design Notes
// ---------------------------------------------------------------------------
export const noteTargetTypeEnum = z.enum(["generator_product", "converter_product"]);

export const designNoteSchema = z.object({
  target_type: noteTargetTypeEnum,
  target_id: z.string().min(1, "Pilih target produk"),
  content: z.string().min(1, "Catatan wajib diisi").max(2000, "Maksimal 2000 karakter"),
  sketch: z.array(z.string()).optional(),
  is_public: z.boolean().default(false),
});
export type DesignNoteFormData = z.infer<typeof designNoteSchema>;

// ---------------------------------------------------------------------------
// Design Consultations (Designer side)
// ---------------------------------------------------------------------------
export const designerConsultationSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200),
  description: z.string().max(2000).optional(),
  budget: z.coerce.number().min(0).optional(),
  client: z.string().min(1, "Klien wajib dipilih").optional(),
});
export type DesignerConsultationFormData = z.infer<typeof designerConsultationSchema>;
