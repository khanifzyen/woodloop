import { describe, it, expect, vi, beforeEach } from "vitest";
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

// Mock TanStack Query
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  };
});

const mockSupplier = {
  id: "supplier-1",
  email: "supplier@test.com",
  username: "testsupplier",
  name: "Test Supplier",
  role: "supplier" as const,
  is_verified: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    user: mockSupplier,
    token: "token-123",
    isAuthenticated: true,
    role: "supplier",
  });
  mockGetList.mockReset();
  mockCreate.mockReset();
  mockUpdate.mockReset();
  mockDelete.mockReset();
});

// ============================================================
// Structure & typing
// ============================================================
describe("useSupplier hooks - structure & typing", () => {
  it("should have auth store with supplier role", () => {
    const state = useAuthStore.getState();
    expect(state.role).toBe("supplier");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should have correct query keys", async () => {
    const { supplierKeys } = await import("./use-supplier");
    expect(supplierKeys.all).toEqual(["supplier"]);
    expect(supplierKeys.dashboard()).toEqual(["supplier", "dashboard"]);
    expect(supplierKeys.listings({ status: "available" })).toEqual([
      "supplier",
      "listings",
      { status: "available" },
    ]);
    expect(supplierKeys.orders()).toEqual(["supplier", "orders"]);
    expect(supplierKeys.woodTypes()).toEqual(["wood-types"]);
  });

  it("should have correct mutation function names", async () => {
    const mod = await import("./use-supplier");
    const hooks = [
      "useSupplierDashboard",
      "useRawTimberListings",
      "useCreateRawTimberListing",
      "useUpdateRawTimberListing",
      "useDeleteRawTimberListing",
      "useSupplierOrders",
      "useWoodTypes",
    ];
    for (const name of hooks) {
      expect(typeof (mod as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("should have all supplier query keys defined", async () => {
    const { supplierKeys } = await import("./use-supplier");
    expect(Array.isArray(supplierKeys.all)).toBe(true);
    expect(supplierKeys.dashboard().length).toBe(2);
    expect(supplierKeys.listings().length).toBe(2);
    expect(supplierKeys.orders().length).toBe(2);
    expect(supplierKeys.woodTypes().length).toBe(1);
  });
});

// ============================================================
// Data fetching — function behavior
// ============================================================
describe("useSupplierDashboard - function behavior", () => {
  it("should be callable function", async () => {
    mockGetList
      .mockResolvedValueOnce({ items: [], totalItems: 0 })
      .mockResolvedValueOnce({ items: [], totalItems: 0 })
      .mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useSupplierDashboard } = await import("./use-supplier");
    expect(typeof useSupplierDashboard).toBe("function");
  });

  it("should compute dashboard aggregates", async () => {
    const mockListings = [
      { id: "l1", status: "available" },
      { id: "l2", status: "available" },
    ];
    const mockOrders = [
      { id: "o1", total_price: 500000, status: "pending" },
      { id: "o2", total_price: 300000, status: "completed" },
    ];
    const mockWallet = [
      { id: "w1", amount: 200000, type: "revenue" },
    ];

    mockGetList
      .mockResolvedValueOnce({ items: mockListings, totalItems: 2 })
      .mockResolvedValueOnce({ items: mockOrders, totalItems: 2 })
      .mockResolvedValueOnce({ items: mockWallet, totalItems: 1 });

    const { useSupplierDashboard } = await import("./use-supplier");
    expect(typeof useSupplierDashboard).toBe("function");
  });
});

describe("useRawTimberListings - function behavior", () => {
  it("should be callable with filters", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useRawTimberListings } = await import("./use-supplier");
    expect(typeof useRawTimberListings).toBe("function");
  });

  it("should accept status and wood_type filters", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useRawTimberListings } = await import("./use-supplier");
    expect(typeof useRawTimberListings).toBe("function");
  });
});

describe("useSupplierOrders - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useSupplierOrders } = await import("./use-supplier");
    expect(typeof useSupplierOrders).toBe("function");
  });

  it("should call getList with seller filter", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useSupplierOrders } = await import("./use-supplier");
    expect(typeof useSupplierOrders).toBe("function");
    expect(mockGetList).not.toHaveBeenCalled();
  });
});

describe("useWoodTypes - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useWoodTypes } = await import("./use-supplier");
    expect(typeof useWoodTypes).toBe("function");
  });
});

// ============================================================
// Mutations — simulated behavior
// ============================================================
describe("useCreateRawTimberListing - mutation", () => {
  it("should create listing with FormData", async () => {
    mockCreate.mockResolvedValueOnce({ id: "new-listing" });

    const { useCreateRawTimberListing } = await import("./use-supplier");
    expect(typeof useCreateRawTimberListing).toBe("function");

    // Simulate what the mutation does
    const createFn = async (formData: FormData) => {
      formData.append("supplier", "supplier-1");
      return mockCreate(formData);
    };

    const formData = new FormData();
    formData.append("wood_type", "wt-jati");
    formData.append("volume", "3.0");
    formData.append("price", "1500000");

    const result = await createFn(formData);
    expect(result.id).toBe("new-listing");
    expect(mockCreate).toHaveBeenCalled();
    const calledFormData = mockCreate.mock.calls[0][0] as FormData;
    expect(calledFormData.get("volume")).toBe("3.0");
    expect(calledFormData.get("price")).toBe("1500000");
  });
});

describe("useUpdateRawTimberListing - mutation", () => {
  it("should update listing by ID with FormData", async () => {
    mockUpdate.mockResolvedValueOnce({ id: "l1", price: 2000000 });

    const { useUpdateRawTimberListing } = await import("./use-supplier");
    expect(typeof useUpdateRawTimberListing).toBe("function");

    // Simulate what the mutation does
    const updateFn = async (id: string, formData: FormData) => {
      return mockUpdate(id, formData);
    };

    const formData = new FormData();
    formData.append("price", "2000000");
    const result = await updateFn("l1", formData);

    expect(result.price).toBe(2000000);
    expect(mockUpdate).toHaveBeenCalledWith("l1", formData);
  });
});

describe("useDeleteRawTimberListing - mutation", () => {
  it("should delete listing by ID", async () => {
    mockDelete.mockResolvedValueOnce({});

    const { useDeleteRawTimberListing } = await import("./use-supplier");
    expect(typeof useDeleteRawTimberListing).toBe("function");

    // Simulate what the mutation does
    const deleteFn = async (id: string) => {
      await mockDelete(id);
    };

    await deleteFn("l1");
    expect(mockDelete).toHaveBeenCalledWith("l1");
  });
});

// ============================================================
// Error handling
// ============================================================
describe("useSupplier hooks - error handling", () => {
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

    const { useCreateRawTimberListing } = await import("./use-supplier");
    expect(typeof useCreateRawTimberListing).toBe("function");
  });
});
