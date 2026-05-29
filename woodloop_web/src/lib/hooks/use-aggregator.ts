import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  Pickup,
  WasteListing,
  WarehouseInventory,
  Bid,
  WoodType,
  WasteForm,
  InventoryStatus,
} from "@/lib/pocketbase/types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const aggregatorKeys = {
  all: ["aggregator"] as const,
  dashboard: () => [...aggregatorKeys.all, "dashboard"] as const,
  pickups: (filters?: object) =>
    filters ? [...aggregatorKeys.all, "pickups", filters] as const
            : [...aggregatorKeys.all, "pickups"] as const,
  warehouse: () => [...aggregatorKeys.all, "warehouse"] as const,
  warehouseLog: () => [...aggregatorKeys.all, "warehouse-log"] as const,
  bids: () => [...aggregatorKeys.all, "bids"] as const,
  availableWaste: (filters?: object) =>
    filters ? [...aggregatorKeys.all, "available-waste", filters] as const
            : [...aggregatorKeys.all, "available-waste"] as const,
  wasteListings: (filters?: object) =>
    filters ? ["waste-listings", filters] as const
            : ["waste-listings"] as const,
  woodTypes: () => ["wood-types"] as const,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getAggregatorId(): string {
  const user = useAuthStore.getState().user;
  if (!user || user.role !== "aggregator") throw new Error("Not an aggregator");
  return user.id;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export interface AggregatorDashboardData {
  pickupsToday: number;
  warehouseStock: number;
  activeBids: number;
  revenue: number;
  recentPickups: Pickup[];
}

export function useAggregatorDashboard() {
  const aggId = getAggregatorId();
  const pb = getPB();

  return useQuery<AggregatorDashboardData>({
    queryKey: aggregatorKeys.dashboard(),
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const [pickups, warehouse, bids, walletTx] = await Promise.all([
        pb.collection<Pickup>("pickups").getList(1, 200, {
          filter: `aggregator="${aggId}"`,
          sort: "-created",
        }),
        pb.collection<WarehouseInventory>("warehouse_inventory").getList(1, 200, {
          filter: `aggregator="${aggId}" && status="in_stock"`,
        }),
        pb.collection<Bid>("bids").getList(1, 200, {
          filter: `bidder="${aggId}" && status="pending"`,
        }),
        pb.collection("wallet_transactions").getList(1, 50, {
          filter: `user="${aggId}" && type="credit"`,
          sort: "-created",
        }),
      ]);

      const todayPickups = pickups.items.filter(
        (p) => p.scheduled_date === today || p.created.startsWith(today)
      );

      const totalRevenue = walletTx.items.reduce(
        (sum, tx) => sum + (tx as unknown as { amount: number }).amount,
        0
      );

      return {
        pickupsToday: todayPickups.length,
        warehouseStock: warehouse.totalItems,
        activeBids: bids.totalItems,
        revenue: totalRevenue,
        recentPickups: pickups.items.slice(0, 5),
      };
    },
  });
}

// ---------------------------------------------------------------------------
// Pickups
// ---------------------------------------------------------------------------
export function usePickups(filters?: { status?: string }) {
  const aggId = getAggregatorId();
  const pb = getPB();

  return useQuery({
    queryKey: aggregatorKeys.pickups(filters),
    queryFn: async () => {
      const filterParts = [`aggregator="${aggId}"`];
      if (filters?.status && filters.status !== "all") {
        filterParts.push(`status="${filters.status}"`);
      }
      const result = await pb.collection("pickups").getList(1, 100, {
        filter: filterParts.join(" && "),
        sort: "-created",
        expand: "waste_listing,waste_listing.wood_type,waste_listing.generator",
      });
      return result as unknown as {
        page: number; perPage: number; totalItems: number; totalPages: number;
        items: (Pickup & { expand?: { waste_listing?: WasteListing & { expand?: { wood_type?: WoodType; generator?: import("@/lib/pocketbase/types").User } } } })[];
      };
    },
  });
}

export function useCreatePickup() {
  const aggId = getAggregatorId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (wasteListingId: string) => {
      return pb.collection("pickups").create({
        aggregator: aggId,
        waste_listing: wasteListingId,
        status: "pending",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aggregatorKeys.pickups() });
      qc.invalidateQueries({ queryKey: aggregatorKeys.dashboard() });
    },
  });
}

export function useUpdatePickupStatus() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, data }: {
      id: string;
      status: "pending" | "on_the_way" | "completed" | "cancelled";
      data?: { weight_verified?: number; pickup_photo?: string[]; notes?: string; scheduled_date?: string };
    }) => {
      return pb.collection("pickups").update(id, { status, ...data });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aggregatorKeys.pickups() });
      qc.invalidateQueries({ queryKey: aggregatorKeys.dashboard() });
      qc.invalidateQueries({ queryKey: aggregatorKeys.warehouse() });
    },
  });
}

// ---------------------------------------------------------------------------
// Warehouse Inventory
// ---------------------------------------------------------------------------
export function useWarehouseInventory() {
  const aggId = getAggregatorId();
  const pb = getPB();

  return useQuery({
    queryKey: aggregatorKeys.warehouse(),
    queryFn: async () => {
      const result = await pb.collection("warehouse_inventory").getList(1, 200, {
        filter: `aggregator="${aggId}"`,
        sort: "-created",
        expand: "wood_type,pickup",
      });
      return result as unknown as {
        page: number; perPage: number; totalItems: number; totalPages: number;
        items: (WarehouseInventory & { expand?: { wood_type?: WoodType; pickup?: Pickup } })[];
      };
    },
  });
}

export function useUpdateInventoryPrice() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, price_per_kg }: { id: string; price_per_kg: number }) => {
      return pb.collection("warehouse_inventory").update(id, { price_per_kg });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aggregatorKeys.warehouse() });
    },
  });
}

// ---------------------------------------------------------------------------
// Bids
// ---------------------------------------------------------------------------
export function useBids() {
  const aggId = getAggregatorId();
  const pb = getPB();

  return useQuery({
    queryKey: aggregatorKeys.bids(),
    queryFn: async () => {
      const result = await pb.collection("bids").getList(1, 200, {
        filter: `bidder="${aggId}"`,
        sort: "-created",
        expand: "waste_listing,waste_listing.wood_type,waste_listing.generator",
      });
      return result as unknown as {
        page: number; perPage: number; totalItems: number; totalPages: number;
        items: (Bid & { expand?: { waste_listing?: WasteListing & { expand?: { wood_type?: WoodType; generator?: import("@/lib/pocketbase/types").User } } } })[];
      };
    },
  });
}

export function useCreateBid() {
  const aggId = getAggregatorId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ waste_listing, bid_amount, message }: {
      waste_listing: string; bid_amount: number; message?: string;
    }) => {
      return pb.collection("bids").create({
        bidder: aggId,
        waste_listing,
        bid_amount,
        message: message || "",
        status: "pending",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aggregatorKeys.bids() });
    },
  });
}

export function useAvailableWasteForBid() {
  const pb = getPB();

  return useQuery({
    queryKey: aggregatorKeys.availableWaste(),
    queryFn: async () => {
      const result = await pb.collection("waste_listings").getList(1, 100, {
        filter: 'status="available" && price_estimate>0',
        sort: "-created",
        expand: "wood_type,generator",
      });
      return result as unknown as {
        page: number; perPage: number; totalItems: number; totalPages: number;
        items: (WasteListing & { expand?: { wood_type?: WoodType; generator?: import("@/lib/pocketbase/types").User } })[];
      };
    },
  });
}

// ---------------------------------------------------------------------------
// Waste Listings (untuk Treasure Map)
// ---------------------------------------------------------------------------
export function useWasteListingsForMap(filters?: {
  wood_type?: string; form?: string; max_distance?: number; max_price?: number;
}) {
  const pb = getPB();

  return useQuery({
    queryKey: aggregatorKeys.wasteListings(filters),
    queryFn: async () => {
      const filterParts: string[] = ['status="available"'];
      if (filters?.wood_type) filterParts.push(`wood_type="${filters.wood_type}"`);
      if (filters?.form) filterParts.push(`form="${filters.form}"`);
      if (filters?.max_price) filterParts.push(`price_estimate<=${filters.max_price}`);

      const result = await pb.collection("waste_listings").getList(1, 200, {
        filter: filterParts.join(" && "),
        sort: "-created",
        expand: "wood_type,generator",
      });
      return result as unknown as {
        page: number; perPage: number; totalItems: number; totalPages: number;
        items: (WasteListing & { expand?: { wood_type?: WoodType; generator?: import("@/lib/pocketbase/types").User & { location_lat?: number; location_lng?: number } } })[];
      };
    },
    refetchInterval: 30_000, // refresh every 30s
  });
}

// ---------------------------------------------------------------------------
// Wood Types
// ---------------------------------------------------------------------------
export function useWoodTypes() {
  const pb = getPB();
  return useQuery({
    queryKey: aggregatorKeys.woodTypes(),
    queryFn: async () => {
      const result = await pb.collection<WoodType>("wood_types").getList(1, 100, { sort: "name" });
      return result.items;
    },
    staleTime: Infinity,
  });
}
