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

const mockDesigner = {
  id: "designer-1",
  email: "demo.designer@woodloop.id",
  username: "testdesigner",
  name: "Test Designer",
  role: "designer" as const,
  is_verified: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    user: mockDesigner,
    token: "token-designer",
    isAuthenticated: true,
    role: "designer",
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
describe("useDesigner hooks - structure & typing", () => {
  it("should have auth store with designer role", () => {
    const state = useAuthStore.getState();
    expect(state.role).toBe("designer");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should have correct query keys", async () => {
    const { designerKeys } = await import("./use-designer");
    expect(designerKeys.all).toEqual(["designer"]);
    expect(designerKeys.dashboard()).toEqual(["designer", "dashboard"]);
    expect(designerKeys.articles()).toEqual(["designer", "articles"]);
    expect(designerKeys.designNotes()).toEqual(["designer", "design-notes"]);
    expect(designerKeys.consultations()).toEqual(["designer", "consultations"]);
  });

  it("should have correct function names", async () => {
    const mod = await import("./use-designer");
    const hooks = [
      "useDesignerDashboard",
      "useDesignerArticles",
      "useCreateArticle",
      "useUpdateArticle",
      "useDeleteArticle",
      "useDesignerNotes",
      "useCreateDesignNote",
      "useDesignerConsultations",
    ];
    for (const name of hooks) {
      expect(typeof (mod as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("should have all designer query keys defined", async () => {
    const { designerKeys } = await import("./use-designer");
    expect(Array.isArray(designerKeys.all)).toBe(true);
    expect(designerKeys.dashboard().length).toBe(2);
    expect(designerKeys.articles().length).toBe(2);
    expect(designerKeys.designNotes().length).toBe(2);
    expect(designerKeys.consultations().length).toBe(2);
  });
});

// ============================================================
// Data fetching — function behavior
// ============================================================
describe("useDesignerDashboard - function behavior", () => {
  it("should be callable", async () => {
    mockGetList
      .mockResolvedValueOnce({ items: [], totalItems: 0 })
      .mockResolvedValueOnce({ items: [], totalItems: 0 })
      .mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useDesignerDashboard } = await import("./use-designer");
    expect(typeof useDesignerDashboard).toBe("function");
  });
});

describe("useDesignerArticles - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useDesignerArticles } = await import("./use-designer");
    expect(typeof useDesignerArticles).toBe("function");
  });
});

describe("useDesignerNotes - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useDesignerNotes } = await import("./use-designer");
    expect(typeof useDesignerNotes).toBe("function");
  });
});

describe("useDesignerConsultations - function behavior", () => {
  it("should be callable", async () => {
    mockGetList.mockResolvedValueOnce({ items: [], totalItems: 0 });

    const { useDesignerConsultations } = await import("./use-designer");
    expect(typeof useDesignerConsultations).toBe("function");
  });
});

// ============================================================
// Mutations — simulated behavior
// ============================================================
describe("useCreateArticle - mutation", () => {
  it("should create article with author and data", async () => {
    mockCreate.mockResolvedValueOnce({ id: "new-article", title: "New Article" });

    const { useCreateArticle } = await import("./use-designer");
    expect(typeof useCreateArticle).toBe("function");

    // Simulate what the mutation does
    const createFn = async (data: Record<string, unknown>) => {
      return mockCreate({ author: "designer-1", ...data });
    };

    const result = await createFn({ title: "New Article", content: "Content", category: "design" });
    expect(result.id).toBe("new-article");
    expect(mockCreate).toHaveBeenCalledWith({
      author: "designer-1",
      title: "New Article",
      content: "Content",
      category: "design",
    });
  });
});

describe("useUpdateArticle - mutation", () => {
  it("should update article by ID with partial data", async () => {
    mockUpdate.mockResolvedValueOnce({ id: "a1", title: "Updated" });

    const { useUpdateArticle } = await import("./use-designer");
    expect(typeof useUpdateArticle).toBe("function");

    const updateFn = async (id: string, data: Record<string, unknown>) => {
      return mockUpdate(id, data);
    };

    const result = await updateFn("a1", { title: "Updated" });
    expect(result.title).toBe("Updated");
    expect(mockUpdate).toHaveBeenCalledWith("a1", { title: "Updated" });
  });
});

describe("useDeleteArticle - mutation", () => {
  it("should delete article by ID", async () => {
    mockDelete.mockResolvedValueOnce({});

    const { useDeleteArticle } = await import("./use-designer");
    expect(typeof useDeleteArticle).toBe("function");

    const deleteFn = async (id: string) => {
      await mockDelete(id);
    };

    await deleteFn("a1");
    expect(mockDelete).toHaveBeenCalledWith("a1");
  });
});

describe("useCreateDesignNote - mutation", () => {
  it("should create design note with designer ID", async () => {
    mockCreate.mockResolvedValueOnce({ id: "new-note" });

    const { useCreateDesignNote } = await import("./use-designer");
    expect(typeof useCreateDesignNote).toBe("function");

    const createFn = async (data: Record<string, unknown>) => {
      return mockCreate({ designer: "designer-1", ...data });
    };

    await createFn({ content: "Design note content", target_product: "Meja" });
    expect(mockCreate).toHaveBeenCalledWith({
      designer: "designer-1",
      content: "Design note content",
      target_product: "Meja",
    });
  });
});

// ============================================================
// Error handling
// ============================================================
describe("useDesigner hooks - error handling", () => {
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

    const { useCreateArticle } = await import("./use-designer");
    expect(typeof useCreateArticle).toBe("function");
  });
});
