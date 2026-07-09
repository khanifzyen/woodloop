import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Marketplace Transaction
// ---------------------------------------------------------------------------
export const mktStatusEnum = z.enum(["pending", "paid", "shipped", "received", "cancelled"]);
export const paymentMethodEnum = z.enum(["wallet", "bank_transfer", "cod"]);

export const marketplaceCheckoutSchema = z.object({
  inventory_item: z.string().min(1, "Pilih bahan"),
  quantity: z.coerce.number().min(0.01, "Minimal 0.01 kg"),
  total_price: z.coerce.number().min(1, "Total harga tidak valid"),
  payment_method: paymentMethodEnum,
  shipping_address: z.string().optional(),
});
export type MarketplaceCheckoutData = z.infer<typeof marketplaceCheckoutSchema>;

// ---------------------------------------------------------------------------
// Products (Upcycled)
// ---------------------------------------------------------------------------
export const productCategoryEnum = z.enum(["furniture", "decor", "accessories", "art", "other"]);

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(200, "Maksimal 200 karakter"),
  description: z.string().max(2000, "Maksimal 2000 karakter").optional(),
  category: productCategoryEnum,
  price: z.coerce.number().min(1, "Harga minimal 1"),
  stock: z.coerce.number().int().min(0, "Stok tidak valid"),
  photos: z.array(z.string()).min(1, "Minimal 1 foto"),
  source_transactions: z.array(z.string()).min(1, "Pilih minimal 1 bahan baku"),
});
export type ProductFormData = z.infer<typeof productSchema>;

// ---------------------------------------------------------------------------
// Design Clinic / Consultation
// ---------------------------------------------------------------------------
export const consultationStatusEnum = z.enum(["open", "negotiation", "in_progress", "completed", "cancelled"]);
export const consultationTypeEnum = z.enum(["client_request", "designer_offer"]);

export const designConsultationSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200, "Maksimal 200 karakter"),
  description: z.string().max(2000, "Maksimal 2000 karakter").optional(),
  budget: z.coerce.number().min(0).optional(),
  type: consultationTypeEnum,
});
export type DesignConsultationFormData = z.infer<typeof designConsultationSchema>;

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
export const materialFilterSchema = z.object({
  wood_type: z.string().optional(),
  form: z.enum(["offcut_large", "offcut_small", "shaving", "sawdust", "logs_end"]).optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  search: z.string().optional(),
});
export type MaterialFilter = z.infer<typeof materialFilterSchema>;
