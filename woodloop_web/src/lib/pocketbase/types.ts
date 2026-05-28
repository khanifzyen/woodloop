/* ===========================================
   WoodLoop TypeScript Types — PocketBase Schema
   Berdasarkan docs/07-skema.md (17 collections)
   =========================================== */

// ========== 1. Users (Auth Collection) ==========
export type UserRole =
  | "supplier" | "generator" | "aggregator"
  | "converter" | "enabler" | "buyer";

export interface User {
  id: string; email: string; username: string;
  name: string; avatar?: string; role: UserRole;
  workshop_name?: string; address?: string;
  location_lat?: number; location_lng?: number;
  phone?: string; is_verified: boolean; bio?: string;
  production_capacity?: string; machine_type?: string;
  fleet_type?: string; warehouse_capacity?: string;
  created: string; updated: string;
}

// ========== 2. Wood Types ==========
export interface WoodType {
  id: string; name: string; carbon_factor: number;
  created: string; updated: string;
}

// ========== 3. Raw Timber Listings ==========
export type TimberShape = "log" | "sawn";
export type TimberGrade = "perhutani" | "kemplengan" | "kayu_rakyat" | "lainnya";

export interface RawTimberListing {
  id: string; supplier: string; wood_type: string;
  expand?: { supplier?: User; wood_type?: WoodType; };
  shape: TimberShape;
  grade?: TimberGrade;
  diameter?: number; length?: number; volume: number;
  price: number; unit: "m3" | "batang" | "ton";
  photos: string[]; legality_doc?: string;
  status: "available" | "sold"; description?: string;
  created: string; updated: string;
}

// ========== 4. Waste Listings ==========
export type WasteForm = "offcut_large" | "offcut_small" | "shaving" | "sawdust" | "logs_end";
export type WasteCondition = "dry" | "wet" | "oiled" | "mixed";
export type WasteUnit = "kg" | "m3" | "sack" | "pickup";
export type WasteStatus = "available" | "booked" | "collected" | "sold";

export interface WasteListing {
  id: string; generator: string; wood_type: string;
  expand?: { generator?: User; wood_type?: WoodType; };
  form: WasteForm; condition: WasteCondition;
  volume: number; unit: WasteUnit;
  photos: string[]; price_estimate: number;
  status: WasteStatus; description?: string;
  created: string; updated: string;
}

// ========== 5. Pickups ==========
export type PickupStatus = "pending" | "on_the_way" | "completed" | "cancelled";

export interface Pickup {
  id: string; aggregator: string; waste_listing: string;
  expand?: { aggregator?: User; waste_listing?: WasteListing; };
  scheduled_date?: string; actual_date?: string;
  status: PickupStatus; weight_verified?: number;
  pickup_photo?: string[]; notes?: string;
  created: string; updated: string;
}

// ========== 6. Warehouse Inventory ==========
export type InventoryStatus = "in_stock" | "reserved" | "sold";

export interface WarehouseInventory {
  id: string; aggregator: string; pickup: string; wood_type?: string;
  expand?: { aggregator?: User; pickup?: Pickup; wood_type?: WoodType; };
  form: WasteForm; weight: number; price_per_kg?: number;
  status: InventoryStatus; photos?: string[];
  created: string; updated: string;
}

// ========== 7. Marketplace Transactions ==========
export type MktStatus = "pending" | "paid" | "shipped" | "received" | "cancelled";
export type PaymentMethod = "wallet" | "bank_transfer" | "cod";

export interface MarketplaceTransaction {
  id: string; buyer: string; seller: string; inventory_item: string;
  expand?: { buyer?: User; seller?: User; inventory_item?: WarehouseInventory; };
  quantity: number; total_price: number; status: MktStatus;
  payment_method: PaymentMethod;
  created: string; updated: string;
}

// ========== 8. Products ==========
export type ProductCategory = "furniture" | "decor" | "accessories" | "art" | "other";

export interface Product {
  id: string; converter: string;
  expand?: { converter?: User; source_transactions?: MarketplaceTransaction[]; };
  name: string; description?: string; category: ProductCategory;
  price: number; stock: number; photos: string[];
  source_transactions: string[]; qr_code_id: string;
  created: string; updated: string;
}

// ========== 9. Orders ==========
export type OrderStatus = "payment_pending" | "paid" | "processing" | "shipped" | "received" | "cancelled";

export interface Order {
  id: string; buyer: string; product: string;
  expand?: { buyer?: User; product?: Product; };
  quantity: number; total_price: number; status: OrderStatus;
  shipping_address: string; snap_token?: string;
  snap_redirect_url?: string; payment_method?: string;
  created: string; updated: string;
}

// ========== 10. Cart Items ==========
export interface CartItem {
  id: string; buyer: string; product: string;
  expand?: { buyer?: User; product?: Product; };
  quantity: number;
  created: string; updated: string;
}

// ========== 11. Wallet Transactions ==========
export type WalletType = "credit" | "debit";
export type WalletRefType = "pickup" | "marketplace_transaction" | "order" | "topup" | "withdrawal";

export interface WalletTransaction {
  id: string; user: string;
  expand?: { user?: User; };
  type: WalletType; amount: number; balance_after?: number;
  description?: string; reference_type: WalletRefType; reference_id?: string;
  created: string; updated: string;
}

// ========== 12. Impact Metrics ==========
export interface ImpactMetric {
  id: string; waste_listing?: string; pickup?: string;
  expand?: { waste_listing?: WasteListing; pickup?: Pickup; };
  co2_saved: number; waste_diverted: number;
  economic_value: number; period: string;
  created: string; updated: string;
}

// ========== 13. Chats ==========
export interface ChatMessage {
  id: string; sender: string; receiver: string;
  expand?: { sender?: User; receiver?: User; };
  message: string; is_read: boolean; attachment?: string;
  created: string; updated: string;
}

// ========== 14. Notifications ==========
export type NotifType = "order" | "pickup" | "payment" | "system" | "promo";

export interface Notification {
  id: string; user: string;
  expand?: { user?: User; };
  title: string; body: string; type: NotifType;
  is_read: boolean; reference_type?: string; reference_id?: string;
  created: string; updated: string;
}

// ========== 15. Design Recipes ==========
export type Difficulty = "easy" | "medium" | "hard";

export interface DesignRecipe {
  id: string; title: string; description?: string;
  suitable_wood_types: string[]; suitable_forms: WasteForm[];
  expand?: { suitable_wood_types?: WoodType[]; author?: User; };
  photos: string[]; author?: string; difficulty: Difficulty;
  created: string; updated: string;
}

// ========== 16. Bids ==========
export type BidStatus = "pending" | "accepted" | "rejected" | "expired";

export interface Bid {
  id: string; bidder: string; waste_listing: string;
  expand?: { bidder?: User; waste_listing?: WasteListing; };
  bid_amount: number; message?: string; status: BidStatus;
  created: string; updated: string;
}

// ========== 17. Generator Products ==========
export type GenProductCategory = "furniture" | "custom_order" | "raw_material" | "other";
export type GenProductStatus = "active" | "sold_out" | "draft";

export interface GeneratorProduct {
  id: string; generator: string;
  expand?: { generator?: User; wood_type?: WoodType; };
  name: string; description?: string; category: GenProductCategory;
  price: number; stock: number; photos: string[];
  wood_type?: string; status: GenProductStatus;
  created: string; updated: string;
}

// ========== 18. User Documents ==========
export type DocStatus = "pending" | "verified" | "rejected";

export interface UserDocument {
  id: string; user: string;
  expand?: { user?: User; };
  type: string; file: string; status: DocStatus; notes?: string;
  created: string; updated: string;
}

// ========== Utility ==========
export interface PBListResult<T> {
  page: number; perPage: number; totalItems: number;
  totalPages: number; items: T[];
}
