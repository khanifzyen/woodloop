import { describe, it, expect, vi, beforeEach } from "vitest";
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

const mockConverter = {
  id: "conv-1",
  email: "e2e.converter@woodloop.id",
  username: "testconv",
  name: "Test Converter",
  role: "converter" as const,
  is_verified: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    user: mockConverter,
    token: "token-conv",
    isAuthenticated: true,
    role: "converter",
  });
});

describe("useConverter hooks - structure & typing", () => {
  it("should have auth store with converter role", () => {
    const state = useAuthStore.getState();
    expect(state.role).toBe("converter");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should have correct query keys", async () => {
    const { converterKeys } = await import("./use-converter");
    expect(converterKeys.all).toEqual(["converter"]);
    expect(converterKeys.dashboard()).toEqual(["converter", "dashboard"]);
    expect(converterKeys.marketplace({ wood_type: "jati" })).toEqual([
      "converter", "marketplace", { wood_type: "jati" },
    ]);
    expect(converterKeys.products()).toEqual(["converter", "products"]);
    expect(converterKeys.transactions()).toEqual(["converter", "transactions"]);
  });

  it("should have correct mutation function names", async () => {
    const mod = await import("./use-converter");
    expect(typeof mod.useConverterDashboard).toBe("function");
    expect(typeof mod.useMarketplaceMaterials).toBe("function");
    expect(typeof mod.useCreateMarketplaceTransaction).toBe("function");
    expect(typeof mod.useConverterProducts).toBe("function");
    expect(typeof mod.useCreateProduct).toBe("function");
    expect(typeof mod.useUpdateProduct).toBe("function");
    expect(typeof mod.useDeleteProduct).toBe("function");
    expect(typeof mod.useDesignRecipes).toBe("function");
  });

  it("should have all converter query keys defined", async () => {
    const { converterKeys } = await import("./use-converter");
    expect(Array.isArray(converterKeys.all)).toBe(true);
    expect(converterKeys.dashboard().length).toBe(2);
    expect(converterKeys.marketplace().length).toBe(2);
    expect(converterKeys.products().length).toBe(2);
    expect(converterKeys.designRecipes().length).toBe(1);
  });
});
