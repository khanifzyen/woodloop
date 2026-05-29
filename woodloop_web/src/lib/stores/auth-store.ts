import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Types minimal — akan diperluas di types.ts nanti
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: "supplier" | "generator" | "aggregator" | "converter" | "enabler" | "buyer";
  workshop_name?: string;
  phone?: string;
  address?: string;
  location_lat?: number;
  location_lng?: number;
  is_verified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  role: AuthUser["role"] | null;
  _hydrated: boolean; // ⬅️ flag untuk memastikan store sudah restore dari localStorage

  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  _setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      _hydrated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          role: user.role,
        }),

      setUser: (user) =>
        set({
          user,
          role: user.role,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: null,
        }),

      _setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "woodloop-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._setHydrated();
        }
      },
    }
  )
);
