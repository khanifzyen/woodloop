import { z } from "zod/v4";

export const timberListingSchema = z.object({
  wood_type: z.string().min(1, "Pilih jenis kayu"),
  diameter: z.coerce.number().min(0, "Diameter tidak valid").optional(),
  length: z.coerce.number().min(0, "Panjang tidak valid").optional(),
  volume: z.coerce.number().min(0.01, "Volume minimal 0.01 m³"),
  price: z.coerce.number().min(1, "Harga wajib diisi"),
  unit: z.enum(["m3", "batang", "ton"]),
  photos: z.array(z.string()).min(1, "Minimal 1 foto"),
  legality_doc: z.string().optional(),
  description: z.string().max(500, "Maksimal 500 karakter").optional(),
});

export type TimberListingFormData = z.infer<typeof timberListingSchema>;

export const timberListingFilterSchema = z.object({
  status: z.enum(["available", "sold"]).optional(),
  wood_type: z.string().optional(),
  search: z.string().optional(),
});

export type TimberListingFilter = z.infer<typeof timberListingFilterSchema>;
