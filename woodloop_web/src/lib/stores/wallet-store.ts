import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WalletState {
  balance: number;
  updateBalance: (amount: number) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      balance: 0,
      updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
    }),
    { name: "woodloop-wallet", storage: createJSONStorage(() => localStorage) }
  )
);
