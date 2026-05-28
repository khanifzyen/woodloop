import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  Product,
  Order,
  CartItem,
} from "@/lib/pocketbase/types";

export const buyerKeys = {
  all: ["buyer"] as const,
  products: (filters?: object) => ["products", filters] as const,
  productDetail: (id: string) => ["products", id] as const,
  traceability: (qrId: string) => ["traceability", qrId] as const,
  orders: (filters?: object) => [...buyerKeys.all, "orders", filters] as const,
  orderDetail: (id: string) => [...buyerKeys.all, "orders", id] as const,
  cart: () => [...buyerKeys.all, "cart"] as const,
};

function getBuyerId(): string {
  const user = useAuthStore.getState().user;
  if (!user || user.role !== "buyer") throw new Error("Not a buyer");
  return user.id;
}

// ─── Products (Marketplace) ───────────────────────────────────────────────
export function useProducts(filters?: {
  category?: string; search?: string;
  sort?: string; priceMin?: number; priceMax?: number;
}) {
  const pb = getPB();
  return useQuery({
    queryKey: buyerKeys.products(filters),
    queryFn: async () => {
      const filterParts: string[] = ["stock>0"];
      if (filters?.category) filterParts.push(`category="${filters.category}"`);
      if (filters?.priceMin) filterParts.push(`price>=${filters.priceMin}`);
      if (filters?.priceMax) filterParts.push(`price<=${filters.priceMax}`);

      let sort = "-created";
      if (filters?.sort === "price_asc") sort = "price";
      else if (filters?.sort === "price_desc") sort = "-price";

      const result = await pb.collection("products").getList(1, 50, {
        filter: filterParts.join(" && "),
        sort,
        expand: "converter",
        fields: "id,name,price,photos,category,description,expand.converter.name",
      });

      let items = (result as unknown as {
        items: (Product & { expand?: { converter?: import("@/lib/pocketbase/types").User } })[];
        page: number; perPage: number; totalItems: number; totalPages: number;
      }).items;

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter((i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description || "").toLowerCase().includes(q)
        );
      }
      return { ...result, items };
    },
    staleTime: 60_000, // 1 menit cache (ISR-like)
  });
}

export function useProductDetail(id: string) {
  const pb = getPB();
  return useQuery({
    queryKey: buyerKeys.productDetail(id),
    queryFn: async () => {
      const product = await pb.collection("products").getOne(id, {
        expand: "converter,source_transactions,source_transactions.inventory_item,source_transactions.inventory_item.wood_type,source_transactions.seller",
      });
      return product as unknown as Product & {
        expand?: {
          converter?: import("@/lib/pocketbase/types").User;
          source_transactions?: (import("@/lib/pocketbase/types").MarketplaceTransaction & {
            expand?: {
              inventory_item?: import("@/lib/pocketbase/types").WarehouseInventory & {
                expand?: { wood_type?: import("@/lib/pocketbase/types").WoodType };
              };
              seller?: import("@/lib/pocketbase/types").User;
            };
          })[];
        };
      };
    },
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────
export function useBuyerOrders(filters?: { status?: string }) {
  const { user, isAuthenticated } = useAuthStore();
  const pb = getPB();

  return useQuery({
    queryKey: buyerKeys.orders(filters),
    queryFn: async () => {
      if (!isAuthenticated || !user || user.role !== "buyer") {
        return { items: [], page: 1, perPage: 100, totalItems: 0, totalPages: 0 };
      }
      const buyerId = user.id;
      const filterParts = [`buyer="${buyerId}"`];
      if (filters?.status && filters.status !== "all") {
        filterParts.push(`status="${filters.status}"`);
      }
      const result = await pb.collection("orders").getList(1, 100, {
        filter: filterParts.join(" && "),
        sort: "-created",
        expand: "product,product.converter",
      });
      return result as unknown as {
        items: (Order & { expand?: { product?: Product & { expand?: { converter?: import("@/lib/pocketbase/types").User } } } })[];
        page: number; perPage: number; totalItems: number; totalPages: number;
      };
    },
  });
}

export function useCreateOrder() {
  const buyerId = getBuyerId();
  const pb = getPB();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      product: string;
      quantity: number;
      total_price: number;
      shipping_address: string;
      payment_method?: string;
    }) => {
      return pb.collection("orders").create({
        buyer: buyerId,
        product: data.product,
        quantity: data.quantity,
        total_price: data.total_price,
        shipping_address: data.shipping_address,
        status: "payment_pending",
        payment_method: data.payment_method || "bank_transfer",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: buyerKeys.orders() });
    },
  });
}

// ─── Cart (sync ke PocketBase) ────────────────────────────────────────────
export function useSyncCart() {
  const buyerId = getBuyerId();
  const pb = getPB();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: { product: string; quantity: number }[]) => {
      // Hapus semua cart items existing lalu buat ulang
      const existing = await pb.collection("cart_items").getList(1, 200, {
        filter: `buyer="${buyerId}"`,
      });
      for (const item of existing.items) {
        await pb.collection("cart_items").delete(item.id);
      }
      for (const item of items) {
        await pb.collection("cart_items").create({
          buyer: buyerId,
          product: item.product,
          quantity: item.quantity,
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: buyerKeys.cart() }),
  });
}
