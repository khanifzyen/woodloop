import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/lib/stores/auth-store";

vi.mock("@/lib/pocketbase/client", () => ({
  getPB: () => ({
    collection: () => ({
      getList: vi.fn().mockResolvedValue({ items: [], totalItems: 0 }),
      getOne: vi.fn().mockResolvedValue({}),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }),
  }),
}));

const mockBuyer = {
  id: "buyer-1",
  email: "e2e.buyer@woodloop.id",
  username: "testbuyer",
  name: "Test Buyer",
  role: "buyer" as const,
  is_verified: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    user: mockBuyer,
    token: "token-buyer",
    isAuthenticated: true,
    role: "buyer",
  });
});

describe("useBuyer hooks - structure & typing", () => {
  it("should have auth store with buyer role", () => {
    const state = useAuthStore.getState();
    expect(state.role).toBe("buyer");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should have correct query keys", async () => {
    const { buyerKeys } = await import("./use-buyer");
    expect(buyerKeys.products({ category: "furniture" })).toEqual([
      "products", { category: "furniture" },
    ]);
    expect(buyerKeys.productDetail("abc")).toEqual(["products", "abc"]);
    expect(buyerKeys.orders()).toEqual(["buyer", "orders", undefined]);
    expect(buyerKeys.traceability("PRD-ABC")).toEqual(["traceability", "PRD-ABC"]);
  });

  it("should have correct function names", async () => {
    const mod = await import("./use-buyer");
    expect(typeof mod.useProducts).toBe("function");
    expect(typeof mod.useProductDetail).toBe("function");
    expect(typeof mod.useBuyerOrders).toBe("function");
    expect(typeof mod.useCreateOrder).toBe("function");
  });
});

describe("CartStore", () => {
  beforeEach(async () => {
    const { useCartStore } = await import("@/lib/stores/cart-store");
    useCartStore.getState().clearCart();
  });

  it("should add item and increment quantity", async () => {
    const { useCartStore } = await import("@/lib/stores/cart-store");
    useCartStore.getState().addItem({ id: "p1", name: "Meja", price: 500000 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);

    useCartStore.getState().addItem({ id: "p1", name: "Meja", price: 500000 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("should remove item", async () => {
    const { useCartStore } = await import("@/lib/stores/cart-store");
    useCartStore.getState().addItem({ id: "p1", name: "Meja", price: 500000 });
    useCartStore.getState().addItem({ id: "p2", name: "Kursi", price: 250000 });
    useCartStore.getState().removeItem("p1");
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe("p2");
  });

  it("should compute total correctly", async () => {
    const { useCartStore } = await import("@/lib/stores/cart-store");
    useCartStore.getState().addItem({ id: "p1", name: "Meja", price: 500000 }, 2);
    useCartStore.getState().addItem({ id: "p2", name: "Kursi", price: 250000 }, 3);
    expect(useCartStore.getState().total()).toBe(1750000);
  });

  it("should compute itemCount correctly", async () => {
    const { useCartStore } = await import("@/lib/stores/cart-store");
    useCartStore.getState().addItem({ id: "p1", name: "Meja", price: 500000 }, 2);
    useCartStore.getState().addItem({ id: "p2", name: "Kursi", price: 250000 }, 3);
    expect(useCartStore.getState().itemCount()).toBe(5);
  });

  it("should clear cart", async () => {
    const { useCartStore } = await import("@/lib/stores/cart-store");
    useCartStore.getState().addItem({ id: "p1", name: "Meja", price: 500000 });
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
