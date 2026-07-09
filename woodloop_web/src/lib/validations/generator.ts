import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Waste Listing
// ---------------------------------------------------------------------------
export const wasteFormEnum = z.enum(["offcut_large", "offcut_small", "shaving", "sawdust", "logs_end"]);
export const wasteConditionEnum = z.enum(["dry", "wet", "oiled", "mixed"]);
export const wasteUnitEnum = z.enum(["kg", "m3", "sack", "pickup"]);
export const wasteStatusEnum = z.enum(["available", "booked", "collected", "sold"]);

export const wasteListingSchema = z.object({
  wood_type: z.string().min(1, "Pilih jenis kayu"),
  form: wasteFormEnum,
  condition: wasteConditionEnum,
  volume: z.coerce.number().min(0.01, "Volume minimal 0.01"),
  unit: wasteUnitEnum,
  photos: z.array(z.string()).min(1, "Minimal 1 foto"),
  price_estimate: z.coerce.number().min(0, "Harga tidak valid"),
  description: z.string().max(500, "Maksimal 500 karakter").optional(),
});
export type WasteListingFormData = z.infer<typeof wasteListingSchema>;

export const wasteListingFilterSchema = z.object({
  status: wasteStatusEnum.optional(),
  form: wasteFormEnum.optional(),
});
export type WasteListingFilter = z.infer<typeof wasteListingFilterSchema>;

// ---------------------------------------------------------------------------
// Generator Product
// ---------------------------------------------------------------------------
export const genProductCategoryEnum = z.enum(["furniture", "custom_order", "raw_material", "other"]);
export const genProductStatusEnum = z.enum(["active", "sold_out", "draft"]);

export const generatorProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(200, "Maksimal 200 karakter"),
  description: z.string().max(1000, "Maksimal 1000 karakter").optional(),
  category: genProductCategoryEnum,
  price: z.coerce.number().min(1, "Harga minimal 1"),
  stock: z.coerce.number().int().min(0, "Stok tidak valid"),
  photos: z.array(z.string()).min(1, "Minimal 1 foto"),
  wood_type: z.string().optional(),
  status: genProductStatusEnum.optional(),
});
export type GeneratorProductFormData = z.infer<typeof generatorProductSchema>;

// ---------------------------------------------------------------------------
// Timber Order
// ---------------------------------------------------------------------------
export const timberOrderSchema = z.object({
  seller: z.string().min(1, "Penjual wajib dipilih"),
  items: z.array(z.object({
    listing: z.string().min(1, "Produk wajib dipilih"),
    quantity: z.coerce.number().int().min(1, "Minimal 1"),
    unit_price: z.coerce.number().min(1, "Harga tidak valid"),
  })).min(1, "Minimal 1 item"),
});
export type TimberOrderFormData = z.infer<typeof timberOrderSchema>;

export const timberMarketplaceFilterSchema = z.object({
  wood_type: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  search: z.string().optional(),
});
export type TimberMarketplaceFilter = z.infer<typeof timberMarketplaceFilterSchema>;
