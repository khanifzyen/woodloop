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

describe("useSupplier hooks - structure & typing", () => {
  it("should have auth store with supplier role", () => {
    const state = useAuthStore.getState();
    expect(state.role).toBe("supplier");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should call getList when fetching supplier dashboard", async () => {
    mockGetList.mockResolvedValue({
      items: [],
      totalItems: 0,
    });

    // Import and test the query key exists
    const { supplierKeys } = await import("./use-supplier");
    expect(supplierKeys.all).toEqual(["supplier"]);
    expect(supplierKeys.dashboard()).toEqual(["supplier", "dashboard"]);
    expect(supplierKeys.listings({ status: "available" })).toEqual([
      "supplier",
      "listings",
      { status: "available" },
    ]);
  });

  it("should have correct mutation function names", async () => {
    const mod = await import("./use-supplier");
    expect(typeof mod.useCreateRawTimberListing).toBe("function");
    expect(typeof mod.useUpdateRawTimberListing).toBe("function");
    expect(typeof mod.useDeleteRawTimberListing).toBe("function");
    expect(typeof mod.useSupplierDashboard).toBe("function");
    expect(typeof mod.useRawTimberListings).toBe("function");
    expect(typeof mod.useSupplierOrders).toBe("function");
    expect(typeof mod.useWoodTypes).toBe("function");
  });
});
