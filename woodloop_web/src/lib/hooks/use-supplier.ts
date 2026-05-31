import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  RawTimberListing,
  Order,
  WoodType,
} from "@/lib/pocketbase/types";
// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const supplierKeys = {
  all: ["supplier"] as const,
  dashboard: () => [...supplierKeys.all, "dashboard"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listings: (filters?: any) =>
    filters ? [...supplierKeys.all, "listings", filters] as const
            : [...supplierKeys.all, "listings"] as const,
  orders: () => [...supplierKeys.all, "orders"] as const,
  woodTypes: () => ["wood-types"] as const,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getSupplierId(): string {
  const user = useAuthStore.getState().user;
  if (!user || user.role !== "supplier") throw new Error("Not a supplier");
  return user.id;
}

// ---------------------------------------------------------------------------
// useSupplierDashboard
// ---------------------------------------------------------------------------
export interface SupplierDashboardData {
  totalListings: number;
  activeListings: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  walletBalance: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "listing_created" | "order_received" | "order_completed" | "listing_sold";
  description: string;
  amount?: number;
  timestamp: string;
}

export function useSupplierDashboard() {
  const supplierId = getSupplierId();
  const pb = getPB();

  return useQuery<SupplierDashboardData>({
    queryKey: supplierKeys.dashboard(),
    queryFn: async (): Promise<SupplierDashboardData> => {
      const [listings, orders, walletTx] = await Promise.all([
        pb.collection<RawTimberListing>("raw_timber_listings").getList(1, 200, {
          filter: `supplier="${supplierId}"`,
          sort: "-created",
          expand: "wood_type",
        }),
        pb.collection<Order>("orders").getList(1, 200, {
          filter: `product ?~ "${supplierId}"`, // simplified; real filter may vary
          sort: "-created",
        }),
        pb.collection("wallet_transactions").getList(1, 50, {
          filter: `user="${supplierId}"`,
          sort: "-created",
        }),
      ]);

      const activeCount = listings.items.filter(
        (l) => l.status === "available"
      ).length;

      const pendingOrders = orders.items.filter(
        (o) => o.status === "payment_pending" || o.status === "paid"
      ).length;

      const completedOrders = orders.items.filter(
        (o) => o.status === "received"
      );

      const totalRevenue = completedOrders.reduce(
        (sum, o) => sum + o.total_price,
        0
      );

      // Last balance from wallet
      const lastTx = walletTx.items[0];
      const walletBalance = lastTx?.balance_after ?? 0;

      // Recent activity
      const recentActivity: ActivityItem[] = [
        ...listings.items.slice(0, 3).map((l) => ({
          id: l.id,
          type: "listing_created" as const,
          description: `Kayu ${l.expand?.wood_type?.name || l.wood_type} — ${l.volume} m³`,
          amount: l.price,
          timestamp: l.created,
        })),
        ...orders.items.slice(0, 3).map((o) => ({
          id: o.id,
          type: (o.status === "received"
            ? "order_completed"
            : "order_received") as ActivityItem["type"],
          description: `Pesanan #${o.id.slice(0, 8)}`,
          amount: o.total_price,
          timestamp: o.created,
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 5);

      return {
        totalListings: listings.totalItems,
        activeListings: activeCount,
        totalOrders: orders.totalItems,
        pendingOrders,
        totalRevenue,
        walletBalance,
        recentActivity,
      };
    },
  });
}

// ---------------------------------------------------------------------------
// useRawTimberListings
// ---------------------------------------------------------------------------
export interface TimberListingsFilter {
  status?: "available" | "sold";
  wood_type?: string;
  search?: string;
}

export function useRawTimberListings(filters?: TimberListingsFilter) {
  const supplierId = getSupplierId();
  const pb = getPB();

  return useQuery({
    queryKey: supplierKeys.listings(filters),
    queryFn: async () => {
      const filterParts = [`supplier="${supplierId}"`];

      if (filters?.status) {
        filterParts.push(`status="${filters.status}"`);
      }
      if (filters?.wood_type) {
        filterParts.push(`wood_type="${filters.wood_type}"`);
      }
      if (filters?.search) {
        filterParts.push(
          `(description ~ "${filters.search}" || wood_type ~ "${filters.search}")`
        );
      }

      const result = await pb
        .collection("raw_timber_listings")
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
        items: (RawTimberListing & {
          expand?: { wood_type?: WoodType };
        })[];
      };
    },
  });
}

// ---------------------------------------------------------------------------
// useWoodTypes
// ---------------------------------------------------------------------------
export function useWoodTypes() {
  const pb = getPB();

  return useQuery({
    queryKey: supplierKeys.woodTypes(),
    queryFn: async () => {
      const result = await pb
        .collection<WoodType>("wood_types")
        .getList(1, 100, { sort: "name" });
      return result.items;
    },
    staleTime: Infinity, // wood types rarely change
  });
}

// ---------------------------------------------------------------------------
// useCreateRawTimberListing
// ---------------------------------------------------------------------------
export function useCreateRawTimberListing() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const record = await pb.collection("raw_timber_listings").create(formData);
      return record;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.listings() });
      qc.invalidateQueries({ queryKey: supplierKeys.dashboard() });
    },
  });
}

// ---------------------------------------------------------------------------
// useUpdateRawTimberListing
// ---------------------------------------------------------------------------
export function useUpdateRawTimberListing() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const record = await pb
        .collection("raw_timber_listings")
        .update(id, formData);
      return record;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.listings() });
      qc.invalidateQueries({ queryKey: supplierKeys.dashboard() });
    },
  });
}

// ---------------------------------------------------------------------------
// useDeleteRawTimberListing
// ---------------------------------------------------------------------------
export function useDeleteRawTimberListing() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection("raw_timber_listings").delete(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.listings() });
      qc.invalidateQueries({ queryKey: supplierKeys.dashboard() });
    },
  });
}

// ---------------------------------------------------------------------------
// useSupplierOrders — fetch from raw_timber_orders where supplier is seller
// ---------------------------------------------------------------------------
export function useSupplierOrders() {
  const supplierId = getSupplierId();
  const pb = getPB();

  return useQuery({
    queryKey: supplierKeys.orders(),
    queryFn: async () => {
      const result = await pb.collection("raw_timber_orders").getList(1, 100, {
        filter: `seller="${supplierId}"`,
        sort: "-created",
        expand: "buyer,listing.wood_type",
      });

      return result as unknown as {
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        items: (import("@/lib/pocketbase/types").RawTimberOrder & {
          expand?: { buyer?: import("@/lib/pocketbase/types").User; listing?: import("@/lib/pocketbase/types").RawTimberListing };
        })[];
      };
    },
  });
}
