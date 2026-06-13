import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  Product,
  Order,
  CartItem,
  Review,
  WishlistItem,
} from "@/lib/pocketbase/types";

export const buyerKeys = {
  all: ["buyer"] as const,
  products: (filters?: object) =>
    filters ? ["products", filters] as const
            : ["products"] as const,
  productDetail: (id: string) => ["products", id] as const,
  traceability: (qrId: string) => ["traceability", qrId] as const,
  orders: (filters?: object) =>
    filters ? [...buyerKeys.all, "orders", filters] as const
            : [...buyerKeys.all, "orders"] as const,
  orderDetail: (id: string) => [...buyerKeys.all, "orders", id] as const,
  cart: () => [...buyerKeys.all, "cart"] as const,
  reviews: (productId: string) => ["reviews", productId] as const,
  wishlist: () => [...buyerKeys.all, "wishlist"] as const,
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
      else if (filters?.sort === "best_selling") sort = "-sold_count";

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

export function useOrderDetail(id: string) {
  const pb = getPB();
  return useQuery({
    queryKey: buyerKeys.orderDetail(id),
    queryFn: async () => {
      const order = await pb.collection("orders").getOne(id, {
        expand: "product,product.converter",
      });
      return order as unknown as Order & {
        expand?: { product?: Product & { expand?: { converter?: import("@/lib/pocketbase/types").User } } };
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

/** Create multiple orders (one per cart item) */
export function useCreateMultiOrders() {
  const buyerId = getBuyerId();
  const pb = getPB();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      items: { productId: string; quantity: number; price: number }[];
      shippingAddress: string;
      paymentMethod?: string;
    }) => {
      const created: Order[] = [];
      for (const item of data.items) {
        const order = await pb.collection("orders").create({
          buyer: buyerId,
          product: item.productId,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          shipping_address: data.shippingAddress,
          status: "payment_pending",
          payment_method: data.paymentMethod || "bank_transfer",
        });
        created.push(order as unknown as Order);
      }
      return created;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: buyerKeys.orders() });
    },
  });
}

/** Pay an order via Midtrans */
export function usePayOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await fetch("/api/midtrans/snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses pembayaran");
      return data as { token: string; redirect_url: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/** Cancel an order */
export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason?: string }) => {
      const pb = getPB();
      await pb.collection("orders").update(orderId, {
        status: "cancelled",
        cancel_reason: reason || "",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: buyerKeys.orders() });
    },
  });
}

/** Confirm received */
export function useConfirmReceived() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const pb = getPB();
      await pb.collection("orders").update(orderId, { status: "received" });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: buyerKeys.orders() });
    },
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────
export function useReviews(productId: string) {
  const pb = getPB();
  return useQuery({
    queryKey: buyerKeys.reviews(productId),
    queryFn: async () => {
      const result = await pb.collection("reviews").getList(1, 50, {
        filter: `product="${productId}"`,
        sort: "-created",
        expand: "buyer",
      });
      return result as unknown as {
        items: (Review & { expand?: { buyer?: import("@/lib/pocketbase/types").User } })[];
        page: number; perPage: number; totalItems: number; totalPages: number;
      };
    },
  });
}

export function useCreateReview() {
  const buyerId = getBuyerId();
  const pb = getPB();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      productId: string;
      orderId: string;
      rating: number;
      comment?: string;
    }) => {
      await pb.collection("reviews").create({
        product: data.productId,
        buyer: buyerId,
        order: data.orderId,
        rating: data.rating,
        comment: data.comment || "",
      });
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: buyerKeys.reviews(variables.productId) });
    },
  });
}

// ─── Wishlist ─────────────────────────────────────────────────────────────
export function useWishlist() {
  const { user, isAuthenticated } = useAuthStore();
  const pb = getPB();
  return useQuery({
    queryKey: buyerKeys.wishlist(),
    queryFn: async () => {
      if (!isAuthenticated || !user || user.role !== "buyer") {
        return { items: [], page: 1, perPage: 200, totalItems: 0, totalPages: 0 };
      }
      const result = await pb.collection("wishlist").getList(1, 200, {
        filter: `buyer="${user.id}"`,
        expand: "product",
      });
      return result as unknown as {
        items: (WishlistItem & { expand?: { product?: Product } })[];
        page: number; perPage: number; totalItems: number; totalPages: number;
      };
    },
  });
}

export function useToggleWishlist() {
  const buyerId = getBuyerId();
  const pb = getPB();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      // Check if already in wishlist
      const existing = await pb.collection("wishlist").getList(1, 1, {
        filter: `buyer="${buyerId}" && product="${productId}"`,
      });
      if (existing.items.length > 0) {
        await pb.collection("wishlist").delete(existing.items[0].id);
        return { added: false };
      } else {
        await pb.collection("wishlist").create({
          buyer: buyerId,
          product: productId,
        });
        return { added: true };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: buyerKeys.wishlist() });
    },
  });
}

export function useIsInWishlist(productId: string) {
  const { user, isAuthenticated } = useAuthStore();
  const pb = getPB();
  return useQuery({
    queryKey: [...buyerKeys.wishlist(), productId],
    queryFn: async () => {
      if (!isAuthenticated || !user || user.role !== "buyer") return false;
      const result = await pb.collection("wishlist").getList(1, 1, {
        filter: `buyer="${user.id}" && product="${productId}"`,
      });
      return result.items.length > 0;
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
