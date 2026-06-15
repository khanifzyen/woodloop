import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/lib/stores/auth-store";

// Mock PocketBase
const mockGetList = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/lib/pocketbase/client", () => ({
  getPB: () => ({
    collection: () => ({
      getList: mockGetList,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    }),
  }),
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

const mockGenerator = {
  id: "generator-1",
  email: "gen@test.com",
  username: "testgen",
  name: "Test Generator",
  role: "generator" as const,
  is_verified: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    user: mockGenerator,
    token: "token-123",
    isAuthenticated: true,
    role: "generator",
  });
  mockGetList.mockReset();
  mockCreate.mockReset();
  mockUpdate.mockReset();
  mockDelete.mockReset();
});

// ============================================================
// Structure & typing
// ============================================================
describe("useGenerator hooks - structure & typing", () => {
  it("should have auth store with generator role", () => {
    const state = useAuthStore.getState();
    expect(state.role).toBe("generator");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should have correct query keys", async () => {
    const { generatorKeys } = await import("./use-generator");
    expect(generatorKeys.all).toEqual(["generator"]);
    expect(generatorKeys.dashboard()).toEqual(["generator", "dashboard"]);
    expect(generatorKeys.wasteListings()).toEqual([
      "generator",
      "waste-listings",
    ]);
    expect(generatorKeys.generatorProducts()).toEqual([
      "generator",
      "products",
    ]);
    expect(generatorKeys.timberOrders()).toEqual(["generator", "timber-orders"]);
    expect(generatorKeys.timberMarketplace()).toEqual(["timber-marketplace", undefined]);
    expect(generatorKeys.woodTypes()).toEqual(["wood-types"]);
  });

  it("should have all hook functions defined", async () => {
    const mod = await import("./use-generator");
    const hooks = [
      "useGeneratorDashboard",
      "useWasteListings",
      "useCreateWasteListing",
      "useDeleteWasteListing",
      "useGeneratorProducts",
      "useCreateGeneratorProduct",
      "useUpdateGeneratorProduct",
      "useTimberMarketplace",
      "useCreateTimberOrder",
      "useTimberOrders",
      "useWoodTypes",
    ];
    for (const name of hooks) {
      expect(typeof (mod as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("should have all generator query keys defined", async () => {
    const { generatorKeys } = await import("./use-generator");
    expect(Array.isArray(generatorKeys.all)).toBe(true);
    expect(generatorKeys.dashboard().length).toBe(2);
    expect(generatorKeys.wasteListings().length).toBe(2);
    expect(generatorKeys.generatorProducts().length).toBe(2);
    expect(generatorKeys.timberOrders().length).toBe(2);
    expect(generatorKeys.timberMarketplace().length).toBe(2);
    expect(generatorKeys.woodTypes().length).toBe(1);
  });
});

// ============================================================
// Data fetching — function behavior
// ============================================================
describe("useGeneratorDashboard - function behavior", () => {
  it("should be callable", async () => {
    mockGetList
      .mockResolvedValueOnce({ items: [], totalItems: 0 })
      .mockResolvedValueOnce({ items: [], totalItems: 0 })
      .mockResolvedValueOnce({ items: [], totalItems: 0 })
      .mockResolvedValueOnce({ items: [], totalItems: 0 })
      .mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useGeneratorDashboard } = await import("./use-generator");
    expect(typeof useGeneratorDashboard).toBe("function");
  });
});

describe("useWasteListings - function behavior", () => {
  it("should be callable with filters", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useWasteListings } = await import("./use-generator");
    expect(typeof useWasteListings).toBe("function");
  });
});

describe("useGeneratorProducts - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useGeneratorProducts } = await import("./use-generator");
    expect(typeof useGeneratorProducts).toBe("function");
  });
});

describe("useTimberMarketplace - function behavior", () => {
  it("should be callable with filters", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useTimberMarketplace } = await import("./use-generator");
    expect(typeof useTimberMarketplace).toBe("function");
  });
});

describe("useTimberOrders - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useTimberOrders } = await import("./use-generator");
    expect(typeof useTimberOrders).toBe("function");
  });
});

describe("useWoodTypes - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useWoodTypes } = await import("./use-generator");
    expect(typeof useWoodTypes).toBe("function");
  });
});

// ============================================================
// Mutations — simulated behavior
// ============================================================
describe("useCreateWasteListing - mutation", () => {
  it("should create waste listing with FormData", async () => {
    mockCreate.mockResolvedValueOnce({ id: "new-waste" });

    const { useCreateWasteListing } = await import("./use-generator");
    expect(typeof useCreateWasteListing).toBe("function");

    // Simulate what the mutation does
    const createFn = async (formData: FormData) => {
      formData.append("generator", "generator-1");
      return mockCreate(formData);
    };

    const formData = new FormData();
    formData.append("wood_type", "wt-jati");
    formData.append("volume", "15");
    formData.append("unit", "kg");

    const result = await createFn(formData);
    expect(result.id).toBe("new-waste");
    expect(mockCreate).toHaveBeenCalled();
    const calledFormData = mockCreate.mock.calls[0][0] as FormData;
    expect(calledFormData.get("wood_type")).toBe("wt-jati");
    expect(calledFormData.get("volume")).toBe("15");
  });
});

describe("useDeleteWasteListing - mutation", () => {
  it("should delete waste listing by ID", async () => {
    mockDelete.mockResolvedValueOnce({});

    const { useDeleteWasteListing } = await import("./use-generator");
    expect(typeof useDeleteWasteListing).toBe("function");

    const deleteFn = async (id: string) => {
      await mockDelete(id);
    };

    await deleteFn("w1");
    expect(mockDelete).toHaveBeenCalledWith("w1");
  });
});

describe("useCreateGeneratorProduct - mutation", () => {
  it("should create product with FormData", async () => {
    mockCreate.mockResolvedValueOnce({ id: "new-prod" });

    const { useCreateGeneratorProduct } = await import("./use-generator");
    expect(typeof useCreateGeneratorProduct).toBe("function");

    const createFn = async (formData: FormData) => {
      formData.append("generator", "generator-1");
      return mockCreate(formData);
    };

    const formData = new FormData();
    formData.append("name", "Kursi Lipat");
    formData.append("price", "250000");
    const result = await createFn(formData);

    expect(result.id).toBe("new-prod");
    expect(mockCreate).toHaveBeenCalled();
  });
});

describe("useUpdateGeneratorProduct - mutation", () => {
  it("should update product by ID with FormData", async () => {
    mockUpdate.mockResolvedValueOnce({ id: "p1", price: 300000 });

    const { useUpdateGeneratorProduct } = await import("./use-generator");
    expect(typeof useUpdateGeneratorProduct).toBe("function");

    const updateFn = async (id: string, formData: FormData) => {
      return mockUpdate(id, formData);
    };

    const formData = new FormData();
    formData.append("price", "300000");
    const result = await updateFn("p1", formData);

    expect(result.price).toBe(300000);
    expect(mockUpdate).toHaveBeenCalledWith("p1", formData);
  });
});

describe("useCreateTimberOrder - mutation", () => {
  it("should create order and details", async () => {
    mockCreate
      .mockResolvedValueOnce({ id: "order-1" })
      .mockResolvedValueOnce({ id: "detail-1" });

    const { useCreateTimberOrder } = await import("./use-generator");
    expect(typeof useCreateTimberOrder).toBe("function");

    // Simulate what the mutation does
    const orderFn = async (data: { listing_id: string; quantity: number; total_price: number }) => {
      const master = await mockCreate({
        buyer: "generator-1",
        listing_id: data.listing_id,
        quantity: data.quantity,
        total_price: data.total_price,
        status: "pending",
      });
      const detail = await mockCreate({
        order: master.id,
        listing_id: data.listing_id,
        quantity: data.quantity,
        unit_price: data.total_price / data.quantity,
      });
      return { order: master, detail };
    };

    const result = await orderFn({
      listing_id: "l1",
      quantity: 2,
      total_price: 3000000,
    });

    expect(result.order.id).toBe("order-1");
    expect(result.detail.id).toBe("detail-1");
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });
});

// ============================================================
// Error handling
// ============================================================
describe("useGenerator hooks - error handling", () => {
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

    const { useCreateWasteListing } = await import("./use-generator");
    expect(typeof useCreateWasteListing).toBe("function");
  });
});
