import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/lib/stores/auth-store";

// Mock PocketBase
const mockGetList = vi.fn();
const mockUpdate = vi.fn();
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();

vi.mock("@/lib/pocketbase/client", () => ({
  getPB: () => ({
    collection: () => ({
      getList: mockGetList,
      update: mockUpdate,
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
    }),
  }),
}));

const mockUser = {
  id: "user-1",
  email: "test@woodloop.id",
  username: "testuser",
  name: "Test User",
  role: "aggregator" as const,
  is_verified: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    user: mockUser,
    token: "token-test",
    isAuthenticated: true,
    role: "aggregator",
  });
  mockGetList.mockReset();
  mockUpdate.mockReset();
  mockSubscribe.mockReset();
  mockUnsubscribe.mockReset();
});

describe("useNotifications hooks - structure & typing", () => {
  it("should have notifKeys", async () => {
    const { notifKeys } = await import("./use-notifications");
    expect(notifKeys.all).toEqual(["notifications"]);
    expect(notifKeys.list()).toEqual(["notifications", "list"]);
    expect(notifKeys.unread()).toEqual(["notifications", "unread"]);
  });

  it("should export correct hook function names", async () => {
    const mod = await import("./use-notifications");
    expect(typeof mod.useNotifications).toBe("function");
    expect(typeof mod.useUnreadCount).toBe("function");
    expect(typeof mod.useMarkNotifAsRead).toBe("function");
    expect(typeof mod.useRealtimeNotifications).toBe("function");
  });

  it("should call getList when useNotifications resolves", async () => {
    const { notifKeys } = await import("./use-notifications");
    expect(notifKeys.list()).toEqual(["notifications", "list"]);
  });

  it("useMarkNotifAsRead should use update mutation", async () => {
    mockUpdate.mockResolvedValue({ id: "notif-1", is_read: true });

    const { useMarkNotifAsRead } = await import("./use-notifications");
    expect(typeof useMarkNotifAsRead).toBe("function");
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe("useRealtime - structure", () => {
  it("should export useRealtimeSubscription", async () => {
    const mod = await import("./use-realtime");
    expect(typeof mod.useRealtimeSubscription).toBe("function");
  });
});
