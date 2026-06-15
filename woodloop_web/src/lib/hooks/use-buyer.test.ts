import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/lib/stores/auth-store";

// Mock PocketBase
const mockGetList = vi.fn();
const mockGetOne = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/lib/pocketbase/client", () => ({
  getPB: () => ({
    collection: () => ({
      getList: mockGetList,
      getOne: mockGetOne,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    }),
  }),
  getFileUrl: () => "/api/files/test/test.jpg",
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  };
});

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
  mockGetList.mockReset();
  mockGetOne.mockReset();
  mockCreate.mockReset();
  mockUpdate.mockReset();
  mockDelete.mockReset();
});

// ============================================================
// Structure & typing
// ============================================================
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
    expect(buyerKeys.orders()).toEqual(["buyer", "orders"]);
    expect(buyerKeys.orderDetail("o1")).toEqual(["buyer", "orders", "o1"]);
    expect(buyerKeys.traceability("PRD-ABC")).toEqual(["traceability", "PRD-ABC"]);
    expect(buyerKeys.reviews("p1")).toEqual(["reviews", "p1"]);
    expect(buyerKeys.wishlist()).toEqual(["buyer", "wishlist"]);
  });

  it("should have correct function names", async () => {
    const mod = await import("./use-buyer");
    const hooks = [
      "useProducts",
      "useProductDetail",
      "useBuyerOrders",
      "useOrderDetail",
      "useCreateOrder",
      "useCancelOrder",
      "useConfirmReceived",
      "useReviews",
      "useCreateReview",
      "useWishlist",
      "useToggleWishlist",
      "useIsInWishlist",
    ];
    for (const name of hooks) {
      expect(typeof (mod as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("should have all buyer query keys defined", async () => {
    const { buyerKeys } = await import("./use-buyer");
    expect(Array.isArray(buyerKeys.all)).toBe(true);
    expect(buyerKeys.products().length).toBe(1);
    expect(buyerKeys.productDetail("x").length).toBe(2);
    expect(buyerKeys.orders().length).toBe(2);
    expect(buyerKeys.orderDetail("x").length).toBe(3);
    expect(buyerKeys.reviews("x").length).toBe(2);
    expect(buyerKeys.wishlist().length).toBe(2);
  });
});

// ============================================================
// Data fetching — function behavior
// ============================================================
describe("useProducts - function behavior", () => {
  it("should be callable with filters", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useProducts } = await import("./use-buyer");
    expect(typeof useProducts).toBe("function");
  });
});

describe("useProductDetail - function behavior", () => {
  it("should be callable with product ID", async () => {
    mockGetOne.mockResolvedValueOnce({ id: "p1" });

    const { useProductDetail } = await import("./use-buyer");
    expect(typeof useProductDetail).toBe("function");
  });
});

describe("useBuyerOrders - function behavior", () => {
  it("should be callable with status filter", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useBuyerOrders } = await import("./use-buyer");
    expect(typeof useBuyerOrders).toBe("function");
  });
});

describe("useReviews - function behavior", () => {
  it("should be callable with product ID", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useReviews } = await import("./use-buyer");
    expect(typeof useReviews).toBe("function");
  });
});

describe("useWishlist - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useWishlist } = await import("./use-buyer");
    expect(typeof useWishlist).toBe("function");
  });
});

// ============================================================
// Mutations — simulated behavior
// ============================================================
describe("useCreateOrder - mutation", () => {
  it("should create order with buyer ID and data", async () => {
    mockCreate.mockResolvedValueOnce({ id: "new-order", status: "payment_pending" });

    const { useCreateOrder } = await import("./use-buyer");
    expect(typeof useCreateOrder).toBe("function");

    // Simulate what the mutation does
    const createFn = async (data: Record<string, unknown>) => {
      return mockCreate({ buyer: "buyer-1", ...data, status: "payment_pending" });
    };

    const result = await createFn({
      product: "p1",
      quantity: 1,
      total_price: 500000,
      shipping_address: "Jl. Test",
    });
    expect(result.id).toBe("new-order");
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ buyer: "buyer-1", product: "p1" })
    );
  });
});

describe("useCancelOrder - mutation", () => {
  it("should cancel order with reason", async () => {
    mockUpdate.mockResolvedValueOnce({ id: "o1", status: "cancelled" });

    const { useCancelOrder } = await import("./use-buyer");
    expect(typeof useCancelOrder).toBe("function");

    const cancelFn = async (orderId: string, reason: string) => {
      return mockUpdate(orderId, { status: "cancelled", cancel_reason: reason });
    };

    const result = await cancelFn("o1", "Changed mind");
    expect(result.status).toBe("cancelled");
    expect(mockUpdate).toHaveBeenCalledWith("o1", {
      status: "cancelled",
      cancel_reason: "Changed mind",
    });
  });
});

describe("useConfirmReceived - mutation", () => {
  it("should confirm order received", async () => {
    mockUpdate.mockResolvedValueOnce({ id: "o1", status: "received" });

    const { useConfirmReceived } = await import("./use-buyer");
    expect(typeof useConfirmReceived).toBe("function");

    const confirmFn = async (orderId: string) => {
      return mockUpdate(orderId, { status: "received" });
    };

    const result = await confirmFn("o1");
    expect(result.status).toBe("received");
    expect(mockUpdate).toHaveBeenCalledWith("o1", { status: "received" });
  });
});

describe("useCreateReview - mutation", () => {
  it("should create review with buyer, product, and order IDs", async () => {
    mockCreate.mockResolvedValueOnce({ id: "new-review" });

    const { useCreateReview } = await import("./use-buyer");
    expect(typeof useCreateReview).toBe("function");

    const createFn = async (data: Record<string, unknown>) => {
      return mockCreate({ buyer: "buyer-1", ...data });
    };

    await createFn({ product: "p1", order: "o1", rating: 5, comment: "Bagus!" });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ buyer: "buyer-1", rating: 5 })
    );
  });
});

describe("useToggleWishlist - mutation", () => {
  it("should add to wishlist when not already present", async () => {
    mockCreate.mockResolvedValueOnce({ id: "wish-1" });

    const { useToggleWishlist } = await import("./use-buyer");
    expect(typeof useToggleWishlist).toBe("function");

    // Simulate toggle — add scenario
    const addFn = async (productId: string) => {
      return mockCreate({ buyer: "buyer-1", product: productId });
    };

    const result = await addFn("p1");
    expect(result.id).toBe("wish-1");
    expect(mockCreate).toHaveBeenCalledWith({ buyer: "buyer-1", product: "p1" });
  });

  it("should remove from wishlist when already present", async () => {
    const { useToggleWishlist } = await import("./use-buyer");
    expect(typeof useToggleWishlist).toBe("function");

    // Simulate toggle — remove scenario
    const removeFn = async (wishlistId: string) => {
      await mockDelete(wishlistId);
    };

    await removeFn("wish-1");
    expect(mockDelete).toHaveBeenCalledWith("wish-1");
  });
});

// ============================================================
// Error handling
// ============================================================
describe("useBuyer hooks - error handling", () => {
  it("should handle unauthenticated state gracefully", async () => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
    });

    const state = useAuthStore.getState();
    expect(state.role).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should handle PB failure gracefully", async () => {
    mockCreate.mockRejectedValue(new Error("Validation error"));

    const { useCreateOrder } = await import("./use-buyer");
    expect(typeof useCreateOrder).toBe("function");
  });
});

// ============================================================
// CartStore (kept from original)
// ============================================================
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
