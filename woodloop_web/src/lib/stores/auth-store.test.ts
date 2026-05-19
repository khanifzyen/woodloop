import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/lib/stores/auth-store";

const mockUser = {
  id: "test-1",
  email: "test@woodloop.app",
  username: "testuser",
  name: "Test User",
  avatar: undefined,
  role: "supplier" as const,
  workshop_name: "Test Workshop",
  phone: "08123456789",
  is_verified: false,
};

describe("AuthStore", () => {
  beforeEach(() => {
    // Reset store sebelum setiap test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
    });
  });

  it("should have initial state with null values", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.role).toBeNull();
  });

  it("should set auth on login", () => {
    const token = "test-token-123";
    useAuthStore.getState().setAuth(mockUser, token);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe("supplier");
  });

  it("should update user role on setUser", () => {
    useAuthStore.getState().setAuth(mockUser, "token");
    const updatedUser = { ...mockUser, role: "generator" as const };
    useAuthStore.getState().setUser(updatedUser);

    const state = useAuthStore.getState();
    expect(state.user?.role).toBe("generator");
    expect(state.role).toBe("generator");
  });

  it("should clear state on logout", () => {
    useAuthStore.getState().setAuth(mockUser, "token");
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.role).toBeNull();
  });

  it("should handle different roles correctly", () => {
    const roles = [
      "supplier",
      "generator",
      "aggregator",
      "converter",
      "enabler",
      "buyer",
    ] as const;

    for (const role of roles) {
      useAuthStore.getState().setAuth({ ...mockUser, role }, "token");
      expect(useAuthStore.getState().role).toBe(role);
    }
  });
});
