import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Pickups
// ---------------------------------------------------------------------------
export const pickupStatusEnum = z.enum(["pending", "on_the_way", "completed", "cancelled"]);

export const pickupSchema = z.object({
  waste_listing: z.string().min(1, "Wajib pilih limbah"),
  scheduled_date: z.string().optional(),
  notes: z.string().max(500, "Maksimal 500 karakter").optional(),
});
export type PickupFormData = z.infer<typeof pickupSchema>;

export const updatePickupStatusSchema = z.object({
  status: pickupStatusEnum,
  actual_date: z.string().optional(),
  weight_verified: z.coerce.number().min(0).optional(),
  pickup_photo: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
});
export type UpdatePickupStatusData = z.infer<typeof updatePickupStatusSchema>;

// ---------------------------------------------------------------------------
// Warehouse Inventory
// ---------------------------------------------------------------------------
export const inventoryStatusEnum = z.enum(["in_stock", "reserved", "sold"]);

export const warehouseInventorySchema = z.object({
  pickup: z.string().min(1, "Wajib pilih pickup"),
  form: z.enum(["offcut_large", "offcut_small", "shaving", "sawdust", "logs_end"]),
  weight: z.coerce.number().min(0.01, "Berat minimal 0.01 kg"),
  price_per_kg: z.coerce.number().min(0, "Harga tidak valid").optional(),
  wood_type: z.string().optional(),
  photos: z.array(z.string()).optional(),
});
export type WarehouseInventoryFormData = z.infer<typeof warehouseInventorySchema>;

// ---------------------------------------------------------------------------
// Bids
// ---------------------------------------------------------------------------
export const bidStatusEnum = z.enum(["pending", "accepted", "rejected", "expired"]);

export const bidSchema = z.object({
  waste_listing: z.string().min(1, "Wajib pilih listing"),
  bid_amount: z.coerce.number().min(1, "Nilai bid minimal 1"),
  message: z.string().max(500, "Maksimal 500 karakter").optional(),
});
export type BidFormData = z.infer<typeof bidSchema>;

export const bidFilterSchema = z.object({
  status: bidStatusEnum.optional(),
  waste_listing: z.string().optional(),
});
export type BidFilter = z.infer<typeof bidFilterSchema>;
