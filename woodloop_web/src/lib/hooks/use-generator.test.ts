import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/lib/stores/auth-store";

vi.mock("@/lib/pocketbase/client", () => ({
  getPB: () => ({
    collection: () => ({
      getList: vi.fn().mockResolvedValue({ items: [], totalItems: 0 }),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
});

describe("useGenerator hooks - structure & typing", () => {
  it("should have auth store with generator role", () => {
    const state = useAuthStore.getState();
    expect(state.role).toBe("generator");
  });

  it("should have correct query keys", async () => {
    const { generatorKeys } = await import("./use-generator");
    expect(generatorKeys.all).toEqual(["generator"]);
    expect(generatorKeys.dashboard()).toEqual(["generator", "dashboard"]);
    expect(generatorKeys.wasteListings()).toEqual([
      "generator",
      "waste-listings",
      undefined,
    ]);
    expect(generatorKeys.generatorProducts()).toEqual([
      "generator",
      "products",
    ]);
  });

  it("should have all hook functions defined", async () => {
    const mod = await import("./use-generator");
    expect(typeof mod.useGeneratorDashboard).toBe("function");
    expect(typeof mod.useWasteListings).toBe("function");
    expect(typeof mod.useCreateWasteListing).toBe("function");
    expect(typeof mod.useGeneratorProducts).toBe("function");
    expect(typeof mod.useCreateGeneratorProduct).toBe("function");
    expect(typeof mod.useTimberMarketplace).toBe("function");
    expect(typeof mod.useCreateTimberOrder).toBe("function");
    expect(typeof mod.useTimberOrders).toBe("function");
    expect(typeof mod.useWoodTypes).toBe("function");
  });
});
