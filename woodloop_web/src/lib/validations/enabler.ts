import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// User Management
// ---------------------------------------------------------------------------
export const userRoleEnum = z.enum([
  "supplier", "generator", "aggregator", "converter", "enabler", "buyer", "designer",
]);

export const userFilterSchema = z.object({
  role: userRoleEnum.optional(),
  verified: z.enum(["all", "verified", "unverified"]).optional(),
  search: z.string().optional(),
});
export type UserFilter = z.infer<typeof userFilterSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  workshop_name: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500).optional(),
  is_verified: z.boolean().optional(),
});
export type UpdateUserData = z.infer<typeof updateUserSchema>;

// ---------------------------------------------------------------------------
// Document Verification
// ---------------------------------------------------------------------------
export const docTypeEnum = z.enum([
  "NIB", "SVLK", "SK_Pengesahan", "Izin_Usaha", "Sertifikat_Lainnya", "Lainnya",
]);

export const documentSchema = z.object({
  user: z.string().min(1, "Pilih user"),
  doc_type: docTypeEnum,
  doc_name: z.string().max(200).optional(),
  file: z.string().min(1, "Upload file"),
});
export type DocumentFormData = z.infer<typeof documentSchema>;

export const verifyDocumentSchema = z.object({
  verified: z.boolean(),
  notes: z.string().max(500).optional(),
});
export type VerifyDocumentData = z.infer<typeof verifyDocumentSchema>;
