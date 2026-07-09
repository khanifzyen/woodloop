import { describe, it, expect } from "vitest";
// Zod v4 schemas are pure functions — no mocks needed

// ---- Generator ----
import {
  wasteListingSchema,
  wasteListingFilterSchema,
  generatorProductSchema,
  timberOrderSchema,
  timberMarketplaceFilterSchema,
} from "./generator";

// ---- Aggregator ----
import {
  pickupSchema,
  updatePickupStatusSchema,
  warehouseInventorySchema,
  bidSchema,
  bidFilterSchema,
} from "./aggregator";

// ---- Converter ----
import {
  marketplaceCheckoutSchema,
  productSchema,
  designConsultationSchema,
  materialFilterSchema,
} from "./converter";

// ---- Buyer ----
import {
  createOrderSchema,
  createFurnitureOrderSchema,
  reviewSchema,
  cartItemSchema,
  buyerProfileSchema,
  marketplaceFilterSchema,
} from "./buyer";

// ---- Enabler ----
import {
  userFilterSchema,
  updateUserSchema,
  documentSchema,
  verifyDocumentSchema,
} from "./enabler";

// ---- Designer ----
import {
  articleSchema,
  designNoteSchema,
  designerConsultationSchema,
} from "./designer";

// ===================================================================
// Generator
// ===================================================================
describe("Generator Validations", () => {
  describe("wasteListingSchema", () => {
    it("accepts valid waste listing", () => {
      const result = wasteListingSchema.safeParse({
        wood_type: "wood-1",
        form: "offcut_large",
        condition: "dry",
        volume: 50,
        unit: "kg",
        photos: ["photo-1.jpg"],
        price_estimate: 10000,
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty wood_type", () => {
      const result = wasteListingSchema.safeParse({
        wood_type: "",
        form: "offcut_large",
        condition: "dry",
        volume: 50,
        unit: "kg",
        photos: ["photo-1.jpg"],
        price_estimate: 10000,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid form enum", () => {
      const result = wasteListingSchema.safeParse({
        wood_type: "wood-1",
        form: "invalid_form",
        condition: "dry",
        volume: 50,
        unit: "kg",
        photos: ["photo-1.jpg"],
        price_estimate: 10000,
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative volume", () => {
      const result = wasteListingSchema.safeParse({
        wood_type: "wood-1",
        form: "offcut_large",
        condition: "dry",
        volume: -1,
        unit: "kg",
        photos: ["photo-1.jpg"],
        price_estimate: 10000,
      });
      expect(result.success).toBe(false);
    });

    it("accepts optional description", () => {
      const result = wasteListingSchema.safeParse({
        wood_type: "wood-1",
        form: "sawdust",
        condition: "dry",
        volume: 10,
        unit: "sack",
        photos: ["photo-1.jpg"],
        price_estimate: 5000,
        description: "Limbah serbuk gergaji",
      });
      expect(result.success).toBe(true);
    });

    it("rejects photos empty array", () => {
      const result = wasteListingSchema.safeParse({
        wood_type: "wood-1",
        form: "offcut_large",
        condition: "dry",
        volume: 50,
        unit: "kg",
        photos: [],
        price_estimate: 10000,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("wasteListingFilterSchema", () => {
    it("accepts empty filter (all optional)", () => {
      const result = wasteListingFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts status filter", () => {
      const result = wasteListingFilterSchema.safeParse({ status: "available" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = wasteListingFilterSchema.safeParse({ status: "deleted" });
      expect(result.success).toBe(false);
    });
  });

  describe("generatorProductSchema", () => {
    it("accepts valid product", () => {
      const result = generatorProductSchema.safeParse({
        name: "Meja Kayu Jati",
        category: "furniture",
        price: 500000,
        stock: 10,
        photos: ["photo-1.jpg"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = generatorProductSchema.safeParse({
        name: "",
        category: "furniture",
        price: 500000,
        stock: 10,
        photos: ["photo-1.jpg"],
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative stock", () => {
      const result = generatorProductSchema.safeParse({
        name: "Meja",
        category: "furniture",
        price: 500000,
        stock: -1,
        photos: ["photo-1.jpg"],
      });
      expect(result.success).toBe(false);
    });

    it("accepts product with optional fields", () => {
      const result = generatorProductSchema.safeParse({
        name: "Meja Kayu Jati",
        description: "Meja dari kayu jati kualitas terbaik",
        category: "furniture",
        price: 500000,
        stock: 10,
        photos: ["photo-1.jpg"],
        wood_type: "wood-1",
        status: "active",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("timberOrderSchema", () => {
    it("accepts valid order with items", () => {
      const result = timberOrderSchema.safeParse({
        seller: "seller-1",
        items: [{ listing: "listing-1", quantity: 2, unit_price: 150000 }],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty items", () => {
      const result = timberOrderSchema.safeParse({
        seller: "seller-1",
        items: [],
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty seller", () => {
      const result = timberOrderSchema.safeParse({
        seller: "",
        items: [{ listing: "listing-1", quantity: 1, unit_price: 100000 }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("timberMarketplaceFilterSchema", () => {
    it("accepts empty filter", () => {
      const result = timberMarketplaceFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts search filter", () => {
      const result = timberMarketplaceFilterSchema.safeParse({ search: "jati" });
      expect(result.success).toBe(true);
    });
  });
});

// ===================================================================
// Aggregator
// ===================================================================
describe("Aggregator Validations", () => {
  describe("pickupSchema", () => {
    it("accepts valid pickup", () => {
      const result = pickupSchema.safeParse({
        waste_listing: "listing-1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty waste_listing", () => {
      const result = pickupSchema.safeParse({ waste_listing: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("updatePickupStatusSchema", () => {
    it("accepts completed status with weight", () => {
      const result = updatePickupStatusSchema.safeParse({
        status: "completed",
        weight_verified: 50,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = updatePickupStatusSchema.safeParse({ status: "unknown" });
      expect(result.success).toBe(false);
    });
  });

  describe("warehouseInventorySchema", () => {
    it("accepts valid inventory", () => {
      const result = warehouseInventorySchema.safeParse({
        pickup: "pickup-1",
        form: "offcut_large",
        weight: 100,
      });
      expect(result.success).toBe(true);
    });

    it("rejects zero weight", () => {
      const result = warehouseInventorySchema.safeParse({
        pickup: "pickup-1",
        form: "offcut_large",
        weight: 0,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("bidSchema", () => {
    it("accepts valid bid", () => {
      const result = bidSchema.safeParse({
        waste_listing: "listing-1",
        bid_amount: 50000,
      });
      expect(result.success).toBe(true);
    });

    it("rejects zero bid amount", () => {
      const result = bidSchema.safeParse({
        waste_listing: "listing-1",
        bid_amount: 0,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("bidFilterSchema", () => {
    it("accepts empty filter", () => {
      const result = bidFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts status filter", () => {
      const result = bidFilterSchema.safeParse({ status: "pending" });
      expect(result.success).toBe(true);
    });
  });
});

// ===================================================================
// Converter
// ===================================================================
describe("Converter Validations", () => {
  describe("marketplaceCheckoutSchema", () => {
    it("accepts valid checkout", () => {
      const result = marketplaceCheckoutSchema.safeParse({
        inventory_item: "inv-1",
        quantity: 10,
        total_price: 50000,
        payment_method: "wallet",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid payment method", () => {
      const result = marketplaceCheckoutSchema.safeParse({
        inventory_item: "inv-1",
        quantity: 10,
        total_price: 50000,
        payment_method: "bitcoin",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("productSchema", () => {
    it("accepts valid upcycled product", () => {
      const result = productSchema.safeParse({
        name: "Kursi Kayu Mahoni",
        category: "furniture",
        price: 250000,
        stock: 5,
        photos: ["photo-1.jpg"],
        source_transactions: ["tx-1"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty source_transactions", () => {
      const result = productSchema.safeParse({
        name: "Kursi",
        category: "furniture",
        price: 250000,
        stock: 5,
        photos: ["photo-1.jpg"],
        source_transactions: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("designConsultationSchema", () => {
    it("accepts valid consultation", () => {
      const result = designConsultationSchema.safeParse({
        title: "Konsultasi desain kursi",
        type: "client_request",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("materialFilterSchema", () => {
    it("accepts empty filter", () => {
      const result = materialFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts all filters", () => {
      const result = materialFilterSchema.safeParse({
        wood_type: "wood-1",
        form: "shaving",
        min_price: 1000,
        max_price: 50000,
        search: "kayu",
      });
      expect(result.success).toBe(true);
    });
  });
});

// ===================================================================
// Buyer
// ===================================================================
describe("Buyer Validations", () => {
  describe("createOrderSchema", () => {
    it("accepts valid order", () => {
      const result = createOrderSchema.safeParse({
        product: "product-1",
        quantity: 2,
        total_price: 500000,
        shipping_address: "Jl. Raya Jepara No. 1, Jepara",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short shipping address", () => {
      const result = createOrderSchema.safeParse({
        product: "product-1",
        quantity: 1,
        total_price: 250000,
        shipping_address: "Alamat",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createFurnitureOrderSchema", () => {
    it("accepts valid furniture order", () => {
      const result = createFurnitureOrderSchema.safeParse({
        product: "product-1",
        seller: "seller-1",
        quantity: 1,
        total_price: 150000,
        shipping_address: "Jl. Raya Jepara No. 1, Jepara",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("reviewSchema", () => {
    it("accepts valid review", () => {
      const result = reviewSchema.safeParse({
        product: "product-1",
        order: "order-1",
        rating: 4,
        comment: "Produk bagus!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects rating 0", () => {
      const result = reviewSchema.safeParse({
        product: "product-1",
        order: "order-1",
        rating: 0,
      });
      expect(result.success).toBe(false);
    });

    it("rejects rating 6", () => {
      const result = reviewSchema.safeParse({
        product: "product-1",
        order: "order-1",
        rating: 6,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("cartItemSchema", () => {
    it("accepts valid cart item", () => {
      const result = cartItemSchema.safeParse({
        product: "product-1",
        quantity: 1,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("marketplaceFilterSchema", () => {
    it("accepts all optional filters", () => {
      const result = marketplaceFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts sort option", () => {
      const result = marketplaceFilterSchema.safeParse({ sort: "cheapest" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid sort", () => {
      const result = marketplaceFilterSchema.safeParse({ sort: "random" });
      expect(result.success).toBe(false);
    });
  });
});

// ===================================================================
// Enabler
// ===================================================================
describe("Enabler Validations", () => {
  describe("userFilterSchema", () => {
    it("accepts empty filter", () => {
      const result = userFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts role filter", () => {
      const result = userFilterSchema.safeParse({ role: "converter" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid role", () => {
      const result = userFilterSchema.safeParse({ role: "admin" });
      expect(result.success).toBe(false);
    });
  });

  describe("updateUserSchema", () => {
    it("accepts partial update", () => {
      const result = updateUserSchema.safeParse({ name: "New Name" });
      expect(result.success).toBe(true);
    });

    it("accepts verification toggle", () => {
      const result = updateUserSchema.safeParse({ is_verified: true });
      expect(result.success).toBe(true);
    });
  });

  describe("documentSchema", () => {
    it("accepts valid document", () => {
      const result = documentSchema.safeParse({
        user: "user-1",
        doc_type: "SVLK",
        file: "file-url.pdf",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty file", () => {
      const result = documentSchema.safeParse({
        user: "user-1",
        doc_type: "SVLK",
        file: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("verifyDocumentSchema", () => {
    it("accepts verification", () => {
      const result = verifyDocumentSchema.safeParse({
        verified: true,
      });
      expect(result.success).toBe(true);
    });

    it("accepts rejection with notes", () => {
      const result = verifyDocumentSchema.safeParse({
        verified: false,
        notes: "Dokumen tidak lengkap",
      });
      expect(result.success).toBe(true);
    });
  });
});

// ===================================================================
// Designer
// ===================================================================
describe("Designer Validations", () => {
  describe("articleSchema", () => {
    it("accepts valid article", () => {
      const result = articleSchema.safeParse({
        title: "Prinsip Dematerialisasi",
        slug: "prinsip-dematerialisasi",
        content: "Artikel tentang dematerialisasi...",
        category: "dematerialization",
        published: false,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid slug characters", () => {
      const result = articleSchema.safeParse({
        title: "Judul Artikel",
        slug: "Judul Artikel With Spaces",
        content: "Content...",
        category: "general",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty title", () => {
      const result = articleSchema.safeParse({
        title: "",
        slug: "empty-title",
        content: "Content...",
        category: "general",
      });
      expect(result.success).toBe(false);
    });

    it("accepts published article", () => {
      const result = articleSchema.safeParse({
        title: "Artikel Published",
        slug: "artikel-published",
        content: "Content...",
        category: "upcycling",
        published: true,
        tags: "upcycling, desain",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("designNoteSchema", () => {
    it("accepts valid design note", () => {
      const result = designNoteSchema.safeParse({
        target_type: "converter_product",
        target_id: "product-1",
        content: "Coba gunakan finishing berbasis air",
        is_public: false,
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty content", () => {
      const result = designNoteSchema.safeParse({
        target_type: "generator_product",
        target_id: "product-1",
        content: "",
        is_public: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("designerConsultationSchema", () => {
    it("accepts valid consultation", () => {
      const result = designerConsultationSchema.safeParse({
        title: "Jasa konsultasi desain produk",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      const result = designerConsultationSchema.safeParse({ title: "" });
      expect(result.success).toBe(false);
    });
  });
});
