import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FurnitureCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  photo?: string;
}

interface FurnitureCartState {
  items: FurnitureCartItem[];
  addItem: (item: Omit<FurnitureCartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useFurnitureCartStore = create<FurnitureCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, qty) =>
        set((state) => ({
          items: qty <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) =>
                i.id === id ? { ...i, quantity: qty } : i
              ),
        })),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "woodloop-furniture-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
