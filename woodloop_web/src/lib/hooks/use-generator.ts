import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  WasteListing,
  WasteForm,
  WasteCondition,
  WasteUnit,
  GeneratorProduct,
  GenProductCategory,
  GenProductStatus,
  RawTimberListing,
  WoodType,
} from "@/lib/pocketbase/types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const generatorKeys = {
  all: ["generator"] as const,
  dashboard: () => [...generatorKeys.all, "dashboard"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wasteListings: (filters?: any) =>
    filters ? [...generatorKeys.all, "waste-listings", filters] as const
            : [...generatorKeys.all, "waste-listings"] as const,
  generatorProducts: () => [...generatorKeys.all, "products"] as const,
  timberOrders: () => [...generatorKeys.all, "timber-orders"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timberMarketplace: (filters?: any) =>
    ["timber-marketplace", filters] as const,
  woodTypes: () => ["wood-types"] as const,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getGeneratorId(): string {
  const user = useAuthStore.getState().user;
  if (!user || user.role !== "generator") throw new Error("Not a generator");
  return user.id;
}

// ---------------------------------------------------------------------------
// useGeneratorDashboard
// ---------------------------------------------------------------------------
export interface GeneratorDashboardData {
  wasteBalance: number;
  totalWasteReported: number;
  activeProducts: number;
  totalTimberOrders: number;
  pendingBids: number;
  recentActivity: GeneratorActivityItem[];
  walletBalance: number;
}

export interface GeneratorActivityItem {
  id: string;
  type: "waste_reported" | "timber_ordered" | "product_created" | "bid_received";
  description: string;
  amount?: number;
  timestamp: string;
}

export function useGeneratorDashboard() {
  const generatorId = getGeneratorId();
  const pb = getPB();

  return useQuery<GeneratorDashboardData>({
    queryKey: generatorKeys.dashboard(),
    queryFn: async (): Promise<GeneratorDashboardData> => {
      const [wasteListings, products, bids, walletTx] = await Promise.all([
        pb.collection<WasteListing>("waste_listings").getList(1, 200, {
          filter: `generator="${generatorId}"`,
          sort: "-created",
        }),
        pb.collection<GeneratorProduct>("generator_products").getList(1, 200, {
          filter: `generator="${generatorId}"`,
          sort: "-created",
        }),
        pb.collection("bids").getList(1, 50, {
          filter: `waste_listing ?~ "${generatorId}"`,
          sort: "-created",
        }),
        pb.collection("wallet_transactions").getList(1, 50, {
          filter: `user="${generatorId}"`,
          sort: "-created",
        }),
      ]);

      const activeProducts = products.items.filter(
        (p) => p.status === "active"
      ).length;

      const totalWaste = wasteListings.items.reduce(
        (sum, w) => sum + w.volume,
        0
      );

      const pendingBids = bids.items.filter(
        (b) => b.status === "pending"
      ).length;

      const lastTx = walletTx.items[0];
      const walletBalance = lastTx?.balance_after ?? 0;

      const recentActivity: GeneratorActivityItem[] = [
        ...wasteListings.items.slice(0, 3).map((w) => ({
          id: w.id,
          type: "waste_reported" as const,
          description: `${w.volume} ${w.unit} — ${w.form}`,
          amount: w.price_estimate,
          timestamp: w.created,
        })),
        ...products.items.slice(0, 2).map((p) => ({
          id: p.id,
          type: "product_created" as const,
          description: p.name,
          amount: p.price,
          timestamp: p.created,
        })),
        ...bids.items.slice(0, 2).map((b) => ({
          id: b.id,
          type: "bid_received" as const,
          description: "Tawaran dari Aggregator",
          amount: b.bid_amount,
          timestamp: b.created,
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 5);

      return {
        wasteBalance: lastTx?.balance_after ?? 0,
        totalWasteReported: totalWaste,
        activeProducts,
        totalTimberOrders: 0, // will be populated when timber orders collection is linked
        pendingBids,
        recentActivity,
        walletBalance,
      };
    },
  });
}

// ---------------------------------------------------------------------------
// useWasteListings
// ---------------------------------------------------------------------------
export interface WasteListingsFilter {
  status?: string;
  form?: string;
}

export function useWasteListings(filters?: WasteListingsFilter) {
  const generatorId = getGeneratorId();
  const pb = getPB();

  return useQuery({
    queryKey: generatorKeys.wasteListings(filters),
    queryFn: async () => {
      const filterParts = [`generator="${generatorId}"`];
      if (filters?.status) filterParts.push(`status="${filters.status}"`);
      if (filters?.form) filterParts.push(`form="${filters.form}"`);

      const result = await pb
        .collection("waste_listings")
        .getList(1, 100, {
          filter: filterParts.join(" && "),
          sort: "-created",
          expand: "wood_type",
        });

      return result as unknown as {
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        items: (WasteListing & {
          expand?: { wood_type?: WoodType };
        })[];
      };
    },
  });
}

// ---------------------------------------------------------------------------
// useCreateWasteListing
// ---------------------------------------------------------------------------
export interface CreateWasteData {
  wood_type: string;
  form: WasteForm;
  condition: WasteCondition;
  volume: number;
  unit: WasteUnit;
  photos: string[];
  price_estimate: number;
  description?: string;
}

export function useCreateWasteListing() {
  const generatorId = getGeneratorId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append("generator", generatorId);
      const record = await pb.collection("waste_listings").create(formData);
      return record;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: generatorKeys.wasteListings() });
      qc.invalidateQueries({ queryKey: generatorKeys.dashboard() });
    },
  });
}

// ---------------------------------------------------------------------------
// useDeleteWasteListing
// ---------------------------------------------------------------------------
export function useDeleteWasteListing() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection("waste_listings").delete(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: generatorKeys.wasteListings() });
      qc.invalidateQueries({ queryKey: generatorKeys.dashboard() });
    },
  });
}

// ---------------------------------------------------------------------------
// useGeneratorProducts
// ---------------------------------------------------------------------------
export function useGeneratorProducts() {
  const generatorId = getGeneratorId();
  const pb = getPB();

  return useQuery({
    queryKey: generatorKeys.generatorProducts(),
    queryFn: async () => {
      const result = await pb
        .collection<GeneratorProduct>("generator_products")
        .getList(1, 100, {
          filter: `generator="${generatorId}"`,
          sort: "-created",
          expand: "wood_type",
        });

      return result as unknown as {
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        items: (GeneratorProduct & {
          expand?: { wood_type?: WoodType };
        })[];
      };
    },
  });
}

// ---------------------------------------------------------------------------
// useCreateGeneratorProduct
// ---------------------------------------------------------------------------
export interface CreateGeneratorProductData {
  name: string;
  description?: string;
  category: GenProductCategory;
  price: number;
  stock: number;
  photos: string[];
  wood_type?: string;
}

export function useCreateGeneratorProduct() {
  const generatorId = getGeneratorId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append("generator", generatorId);
      const record = await pb.collection("generator_products").create(formData);
      return record;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: generatorKeys.generatorProducts() });
      qc.invalidateQueries({ queryKey: generatorKeys.dashboard() });
    },
  });
}

// ---------------------------------------------------------------------------
// useTimberMarketplace
// ---------------------------------------------------------------------------
export interface TimberMarketplaceFilter {
  wood_type?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export function useTimberMarketplace(filters?: TimberMarketplaceFilter) {
  const pb = getPB();

  return useQuery({
    queryKey: generatorKeys.timberMarketplace(filters),
    queryFn: async () => {
      const filterParts = ['status="available"', "stock>0"];

      if (filters?.wood_type) {
        filterParts.push(`wood_type="${filters.wood_type}"`);
      }
      if (filters?.min_price !== undefined) {
        filterParts.push(`price >= ${filters.min_price}`);
      }
      if (filters?.max_price !== undefined) {
        filterParts.push(`price <= ${filters.max_price}`);
      }
      if (filters?.search) {
        filterParts.push(
          `description ~ "${filters.search}"`
        );
      }

      const result = await pb
        .collection("raw_timber_listings")
        .getList(1, 100, {
          filter: filterParts.join(" && "),
          sort: "-created",
          expand: "wood_type,supplier",
        });

      return result as unknown as {
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        items: (RawTimberListing & {
          expand?: { wood_type?: WoodType; supplier?: import("@/lib/pocketbase/types").User };
        })[];
      };
    },
  });
}

// ---------------------------------------------------------------------------
// useCreateTimberOrder — creates raw_timber_orders (Generator → Supplier)
// ---------------------------------------------------------------------------
export function useCreateTimberOrder() {
  const generatorId = getGeneratorId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listing,
      seller,
      quantity,
      total_price,
    }: {
      listing: string;
      seller: string;
      quantity: number;
      total_price: number;
    }) => {
      const record = await pb.collection("raw_timber_orders").create({
        buyer: generatorId,
        seller,
        listing,
        quantity,
        total_price,
        status: "payment_pending",
      });
      return record;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: generatorKeys.timberOrders() });
      qc.invalidateQueries({ queryKey: generatorKeys.dashboard() });
    },
  });
}

// ---------------------------------------------------------------------------
// useTimberOrders — fetch from raw_timber_orders
// ---------------------------------------------------------------------------
export function useTimberOrders() {
  const generatorId = getGeneratorId();
  const pb = getPB();

  return useQuery({
    queryKey: generatorKeys.timberOrders(),
    queryFn: async () => {
      const result = await pb.collection("raw_timber_orders").getList(1, 100, {
        filter: `buyer="${generatorId}"`,
        sort: "-created",
        expand: "listing,seller",
      });

      return result as unknown as {
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        items: (import("@/lib/pocketbase/types").RawTimberOrder & {
          expand?: { listing?: import("@/lib/pocketbase/types").RawTimberListing; seller?: import("@/lib/pocketbase/types").User };
        })[];
      };
    },
  });
}

// ---------------------------------------------------------------------------
// useWoodTypes (shared)
// ---------------------------------------------------------------------------
export function useWoodTypes() {
  const pb = getPB();

  return useQuery({
    queryKey: generatorKeys.woodTypes(),
    queryFn: async () => {
      const result = await pb
        .collection<WoodType>("wood_types")
        .getList(1, 100, { sort: "name" });
      return result.items;
    },
    staleTime: Infinity,
  });
}
