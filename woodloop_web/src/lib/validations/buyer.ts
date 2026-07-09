import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------
export const orderStatusEnum = z.enum([
  "payment_pending", "paid", "processing", "shipped", "received", "cancelled",
]);

export const createOrderSchema = z.object({
  product: z.string().min(1, "Pilih produk"),
  quantity: z.coerce.number().int().min(1, "Minimal 1"),
  total_price: z.coerce.number().min(1, "Total harga tidak valid"),
  shipping_address: z.string().min(10, "Alamat minimal 10 karakter"),
  shipping_lat: z.coerce.number().optional(),
  shipping_lng: z.coerce.number().optional(),
  payment_method: z.enum(["wallet", "bank_transfer"]).optional(),
});
export type CreateOrderData = z.infer<typeof createOrderSchema>;

// ---------------------------------------------------------------------------
// Furniture Order (Buyer → Generator)
// ---------------------------------------------------------------------------
export const createFurnitureOrderSchema = z.object({
  product: z.string().min(1, "Pilih produk"),
  seller: z.string().min(1, "Penjual wajib dipilih"),
  quantity: z.coerce.number().int().min(1, "Minimal 1"),
  total_price: z.coerce.number().min(1, "Total harga tidak valid"),
  shipping_address: z.string().min(10, "Alamat minimal 10 karakter"),
});
export type CreateFurnitureOrderData = z.infer<typeof createFurnitureOrderSchema>;

// ---------------------------------------------------------------------------
// Review
// ---------------------------------------------------------------------------
export const reviewSchema = z.object({
  product: z.string().min(1, "Pilih produk"),
  order: z.string().min(1, "Pilih pesanan"),
  rating: z.coerce.number().int().min(1, "Minimal 1 bintang").max(5, "Maksimal 5 bintang"),
  comment: z.string().max(1000, "Maksimal 1000 karakter").optional(),
});
export type ReviewFormData = z.infer<typeof reviewSchema>;

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------
export const cartItemSchema = z.object({
  product: z.string().min(1, "Pilih produk"),
  quantity: z.coerce.number().int().min(1, "Minimal 1"),
});
export type CartItemData = z.infer<typeof cartItemSchema>;

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export const buyerProfileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").optional(),
  phone: z.string().optional(),
  address: z.string().max(500).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().optional(),
});
export type BuyerProfileData = z.infer<typeof buyerProfileSchema>;

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
export const marketplaceFilterSchema = z.object({
  category: z.enum(["furniture", "decor", "accessories", "art", "other"]).optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "cheapest", "most_expensive", "popular"]).optional(),
});
export type MarketplaceFilter = z.infer<typeof marketplaceFilterSchema>;
