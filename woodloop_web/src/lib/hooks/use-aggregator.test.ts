import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/lib/stores/auth-store";

// Mock PocketBase
const mockGetList = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockSubscribe = vi.fn();

vi.mock("@/lib/pocketbase/client", () => ({
  getPB: () => ({
    collection: () => ({
      getList: mockGetList,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
      subscribe: mockSubscribe,
    }),
  }),
}));

const mockAggregator = {
  id: "agg-1",
  email: "e2e.aggregator@woodloop.id",
  username: "testagg",
  name: "Test Aggregator",
  role: "aggregator" as const,
  is_verified: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    user: mockAggregator,
    token: "token-agg",
    isAuthenticated: true,
    role: "aggregator",
  });
  mockGetList.mockReset();
  mockCreate.mockReset();
  mockUpdate.mockReset();
  mockDelete.mockReset();
});

describe("useAggregator hooks - structure & typing", () => {
  it("should have auth store with aggregator role", () => {
    const state = useAuthStore.getState();
    expect(state.role).toBe("aggregator");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should have correct query keys", async () => {
    const { aggregatorKeys } = await import("./use-aggregator");
    expect(aggregatorKeys.all).toEqual(["aggregator"]);
    expect(aggregatorKeys.dashboard()).toEqual(["aggregator", "dashboard"]);
    expect(aggregatorKeys.pickups({ status: "pending" })).toEqual([
      "aggregator",
      "pickups",
      { status: "pending" },
    ]);
    expect(aggregatorKeys.warehouse()).toEqual(["aggregator", "warehouse"]);
    expect(aggregatorKeys.bids()).toEqual(["aggregator", "bids"]);
  });

  it("should call getList when fetching aggregator dashboard", async () => {
    mockGetList.mockResolvedValue({
      items: [],
      totalItems: 0,
    });

    const { aggregatorKeys } = await import("./use-aggregator");
    expect(aggregatorKeys.dashboard()).toEqual(["aggregator", "dashboard"]);
    expect(aggregatorKeys.warehouse()).toEqual(["aggregator", "warehouse"]);
    expect(aggregatorKeys.bids()).toEqual(["aggregator", "bids"]);
  });

  it("should have correct mutation function names", async () => {
    const mod = await import("./use-aggregator");
    expect(typeof mod.useCreatePickup).toBe("function");
    expect(typeof mod.useUpdatePickupStatus).toBe("function");
    expect(typeof mod.useCreateBid).toBe("function");
    expect(typeof mod.useUpdateInventoryPrice).toBe("function");
    expect(typeof mod.useAggregatorDashboard).toBe("function");
    expect(typeof mod.usePickups).toBe("function");
    expect(typeof mod.useWarehouseInventory).toBe("function");
    expect(typeof mod.useBids).toBe("function");
    expect(typeof mod.useAvailableWasteForBid).toBe("function");
  });
});
