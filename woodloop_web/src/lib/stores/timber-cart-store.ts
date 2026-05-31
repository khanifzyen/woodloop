import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface TimberCartItem {
  listing_id: string;
  listing_name: string;
  unit_price: number;
  quantity: number;
  stock_available: number;
  supplier_id: string;
  supplier_name: string;
  wood_type_name: string;
  photo_url?: string;
}

interface TimberCartState {
  items: TimberCartItem[];
  addItem: (item: Omit<TimberCartItem, "quantity">, qty?: number) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, qty: number) => void;
  clearCart: () => void;
  getGroupedBySupplier: () => Map<string, TimberCartItem[]>;
  getSupplierTotal: (supplierId: string) => number;
  getGrandTotal: () => number;
  getItemCount: () => number;
  hasItem: (listingId: string) => boolean;
}

export const useTimberCartStore = create<TimberCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.listing_id === item.listing_id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.listing_id === item.listing_id
                  ? { ...i, quantity: Math.min(i.quantity + qty, i.stock_available) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(qty, item.stock_available) },
            ],
          };
        });
      },

      removeItem: (listingId) => {
        set((state) => ({
          items: state.items.filter((i) => i.listing_id !== listingId),
        }));
      },

      updateQuantity: (listingId, qty) => {
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.listing_id !== listingId) };
          }
          return {
            items: state.items.map((i) =>
              i.listing_id === listingId
                ? { ...i, quantity: Math.min(qty, i.stock_available) }
                : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getGroupedBySupplier: () => {
        const items = get().items;
        const grouped = new Map<string, TimberCartItem[]>();
        for (const item of items) {
          const existing = grouped.get(item.supplier_id) || [];
          existing.push(item);
          grouped.set(item.supplier_id, existing);
        }
        return grouped;
      },

      getSupplierTotal: (supplierId) => {
        return get()
          .items.filter((i) => i.supplier_id === supplierId)
          .reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
      },

      getGrandTotal: () => {
        return get().items.reduce(
          (sum, i) => sum + i.unit_price * i.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      hasItem: (listingId) => {
        return get().items.some((i) => i.listing_id === listingId);
      },
    }),
    {
      name: "woodloop-timber-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
