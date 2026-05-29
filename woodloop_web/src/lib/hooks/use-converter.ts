import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  Product,
  MarketplaceTransaction,
  WarehouseInventory,
  DesignRecipe,
  WoodType,
  User,
  ProductCategory,
} from "@/lib/pocketbase/types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const converterKeys = {
  all: ["converter"] as const,
  dashboard: () => [...converterKeys.all, "dashboard"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  marketplace: (filters?: any) =>
    filters ? [...converterKeys.all, "marketplace", filters] as const
            : [...converterKeys.all, "marketplace"] as const,
  transactions: () => [...converterKeys.all, "transactions"] as const,
  products: () => [...converterKeys.all, "products"] as const,
  designRecipes: (filters?: object) =>
    filters ? ["design-recipes", filters] as const
            : ["design-recipes"] as const,
  woodTypes: () => ["wood-types"] as const,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getConverterId(): string {
  const user = useAuthStore.getState().user;
  if (!user || user.role !== "converter") throw new Error("Not a converter");
  return user.id;
}

function generateQRCodeId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "PRD-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export interface ConverterDashboardData {
  materialsBought: number;
  productsCreated: number;
  totalInvestment: number;
  designsAvailable: number;
  recentTransactions: MarketplaceTransaction[];
}

export function useConverterDashboard() {
  const converterId = getConverterId();
  const pb = getPB();

  return useQuery<ConverterDashboardData>({
    queryKey: converterKeys.dashboard(),
    queryFn: async () => {
      const [txs, products, recipes] = await Promise.all([
        pb.collection<MarketplaceTransaction>("marketplace_transactions").getList(1, 200, {
          filter: `buyer="${converterId}"`,
          sort: "-created",
        }),
        pb.collection<Product>("products").getList(1, 200, {
          filter: `converter="${converterId}"`,
        }),
        pb.collection<DesignRecipe>("design_recipes").getList(1, 1, { skipTotal: true }),
      ]);

      const totalInvestment = txs.items
        .filter((t) => t.status === "paid" || t.status === "received")
        .reduce((sum, t) => sum + t.total_price, 0);

      // Get actual total count for recipes
      const allRecipes = await pb.collection<DesignRecipe>("design_recipes").getList(1, 200);

      return {
        materialsBought: txs.totalItems,
        productsCreated: products.totalItems,
        totalInvestment,
        designsAvailable: allRecipes.totalItems,
        recentTransactions: txs.items.slice(0, 5),
      };
    },
  });
}

// ---------------------------------------------------------------------------
// Marketplace Materials
// ---------------------------------------------------------------------------
export interface MarketplaceFilters {
  wood_type?: string;
  form?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  search?: string;
}

export function useMarketplaceMaterials(filters?: MarketplaceFilters) {
  const pb = getPB();

  return useQuery({
    queryKey: converterKeys.marketplace(filters),
    queryFn: async () => {
      const filterParts = ['status="in_stock"', "price_per_kg>0"];
      if (filters?.wood_type) filterParts.push(`wood_type="${filters.wood_type}"`);
      if (filters?.form) filterParts.push(`form="${filters.form}"`);
      if (filters?.priceMin) filterParts.push(`price_per_kg>=${filters.priceMin}`);
      if (filters?.priceMax) filterParts.push(`price_per_kg<=${filters.priceMax}`);

      let sort = "-created";
      if (filters?.sort === "price_asc") sort = "price_per_kg";
      else if (filters?.sort === "price_desc") sort = "-price_per_kg";
      else if (filters?.sort === "oldest") sort = "created";

      const result = await pb.collection("warehouse_inventory").getList(1, 100, {
        filter: filterParts.join(" && "),
        sort,
        expand: "wood_type,aggregator,pickup",
      });

      let items = (result as unknown as {
        page: number; perPage: number; totalItems: number; totalPages: number;
        items: (WarehouseInventory & { expand?: { wood_type?: WoodType; aggregator?: User; pickup?: import("@/lib/pocketbase/types").Pickup } })[];
      }).items;

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter((i) => {
          const name = i.expand?.wood_type?.name?.toLowerCase() || "";
          return name.includes(q) || i.form?.toLowerCase().includes(q);
        });
      }

      return { ...result, items };
    },
  });
}

// ---------------------------------------------------------------------------
// Create Marketplace Transaction (Buy materials)
// ---------------------------------------------------------------------------
export function useCreateMarketplaceTransaction() {
  const converterId = getConverterId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      inventory_item: string;
      seller: string;
      quantity: number;
      total_price: number;
      payment_method: "wallet" | "bank_transfer" | "cod";
    }) => {
      return pb.collection("marketplace_transactions").create({
        buyer: converterId,
        seller: data.seller,
        inventory_item: data.inventory_item,
        quantity: data.quantity,
        total_price: data.total_price,
        status: "pending",
        payment_method: data.payment_method,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: converterKeys.dashboard() });
      qc.invalidateQueries({ queryKey: converterKeys.transactions() });
      qc.invalidateQueries({ queryKey: converterKeys.marketplace() });
    },
  });
}

// ---------------------------------------------------------------------------
// Transactions History
// ---------------------------------------------------------------------------
export function useConverterTransactions() {
  const converterId = getConverterId();
  const pb = getPB();

  return useQuery({
    queryKey: converterKeys.transactions(),
    queryFn: async () => {
      const result = await pb.collection("marketplace_transactions").getList(1, 200, {
        filter: `buyer="${converterId}"`,
        sort: "-created",
        expand: "inventory_item,inventory_item.wood_type,seller",
      });
      return result as unknown as {
        page: number; perPage: number; totalItems: number; totalPages: number;
        items: (MarketplaceTransaction & { expand?: { inventory_item?: WarehouseInventory & { expand?: { wood_type?: WoodType } }; seller?: User } })[];
      };
    },
  });
}

// ---------------------------------------------------------------------------
// Converter Products
// ---------------------------------------------------------------------------
export function useConverterProducts() {
  const converterId = getConverterId();
  const pb = getPB();

  return useQuery({
    queryKey: converterKeys.products(),
    queryFn: async () => {
      const result = await pb.collection<Product>("products").getList(1, 200, {
        filter: `converter="${converterId}"`,
        sort: "-created",
        expand: "source_transactions",
      });
      return result;
    },
  });
}

export function useCreateProduct() {
  const converterId = getConverterId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      category: ProductCategory;
      price: number;
      stock: number;
      photos?: string[];
      source_transactions?: string[];
    }) => {
      return pb.collection("products").create({
        converter: converterId,
        name: data.name,
        description: data.description || "",
        category: data.category,
        price: data.price,
        stock: data.stock,
        photos: data.photos || [],
        source_transactions: data.source_transactions || [],
        qr_code_id: generateQRCodeId(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: converterKeys.products() });
      qc.invalidateQueries({ queryKey: converterKeys.dashboard() });
    },
  });
}

export function useUpdateProduct() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: {
      id: string;
      data: Partial<{ name: string; description: string; category: ProductCategory; price: number; stock: number; photos: string[] }>;
    }) => {
      return pb.collection("products").update(id, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: converterKeys.products() });
    },
  });
}

export function useDeleteProduct() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection("products").delete(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: converterKeys.products() });
      qc.invalidateQueries({ queryKey: converterKeys.dashboard() });
    },
  });
}

// ---------------------------------------------------------------------------
// Design Recipes
// ---------------------------------------------------------------------------
export function useDesignRecipes(filters?: { difficulty?: string; wood_type?: string; search?: string }) {
  const pb = getPB();

  return useQuery({
    queryKey: converterKeys.designRecipes(filters),
    queryFn: async () => {
      const filterParts: string[] = [];
      if (filters?.difficulty) filterParts.push(`difficulty="${filters.difficulty}"`);

      const result = await pb.collection("design_recipes").getList(1, 100, {
        filter: filterParts.join(" && "),
        sort: "-created",
        expand: "suitable_wood_types,author",
      });

      let items = (result as unknown as {
        page: number; perPage: number; totalItems: number; totalPages: number;
        items: (DesignRecipe & { expand?: { suitable_wood_types?: WoodType[]; author?: User } })[];
      }).items;

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter((i) =>
          i.title.toLowerCase().includes(q) ||
          (i.description || "").toLowerCase().includes(q)
        );
      }

      if (filters?.wood_type) {
        items = items.filter((i) =>
          i.suitable_wood_types?.includes(filters.wood_type!) ||
          i.expand?.suitable_wood_types?.some((wt) => wt.id === filters.wood_type)
        );
      }

      return { ...result, items };
    },
  });
}

// ---------------------------------------------------------------------------
// Wood Types
// ---------------------------------------------------------------------------
export function useWoodTypes() {
  const pb = getPB();
  return useQuery({
    queryKey: converterKeys.woodTypes(),
    queryFn: async () => {
      const result = await pb.collection<WoodType>("wood_types").getList(1, 100, { sort: "name" });
      return result.items;
    },
    staleTime: Infinity,
  });
}
