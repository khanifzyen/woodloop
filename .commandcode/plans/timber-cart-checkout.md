# Timber Cart + Checkout (Generator → Supplier)

## Summary
Generator bisa add multiple kayu ke keranjang (localStorage), lalu checkout — 1 master order per supplier, multiple detail lines. Harga divalidasi server-side.

---

## Schema Changes

### 1. `raw_timber_orders` (modified)
- **Remove** field: `listing`
- **Remove** field: `quantity`
- **Keep**: `buyer`, `seller`, `total_price`, `status`, `notes`

### 2. `raw_timber_order_details` (new collection)

| Field | Type | Notes |
|-------|------|-------|
| `order` | relation → `raw_timber_orders` | single, required, cascadeDelete |
| `listing` | relation → `raw_timber_listings` | single, required |
| `quantity` | number | required, min: 1 |
| `unit_price` | number | required — **server-validated**, never trust client |
| `subtotal` | number | required — `quantity * unit_price` |

**Rules:**
- List/View: `@request.auth.id = order.buyer || @request.auth.id = order.seller`
- Create: `@request.auth.role = "generator"`
- Update: `""` (immutable)
- Delete: `""` (immutable)

### 3. Migration: Backfill Existing Orders
One-time script: untuk setiap `raw_timber_orders` yang punya `listing != ""`, buat 1 record di `raw_timber_order_details`.

---

## Files

### Create
| # | File | Purpose |
|---|------|---------|
| 1 | `migration/collections/19_raw_timber_order_details.js` | Migration for new collection |
| 2 | `migration/collections/20_backfill_order_details.js` | Backfill existing orders |
| 3 | `src/lib/stores/timber-cart-store.ts` | Zustand cart store (localStorage persist) |
| 4 | `src/app/(dashboard)/generator/cart/page.tsx` | Cart page — grouped by supplier |
| 5 | `src/app/(dashboard)/generator/checkout/page.tsx` | Checkout page — create orders |

### Modify
| # | File | Changes |
|---|------|---------|
| 6 | `src/lib/pocketbase/types.ts` | Add `RawTimberOrderDetail`, update `RawTimberOrder` (remove `listing`) |
| 7 | `src/components/features/timber-card.tsx` | Prop `onOrder` → `onAddToCart`, button text "+ Keranjang" |
| 8 | `src/app/(dashboard)/generator/buy-timber/page.tsx` | Replace direct order with add-to-cart, header cart icon + badge |
| 9 | `src/lib/hooks/use-generator.ts` | New `useCreateTimberOrderFromCart()`, update `useTimberOrders` expand |
| 10 | `src/lib/hooks/use-supplier.ts` | Update `useSupplierOrders` expand |
| 11 | `src/app/(dashboard)/generator/timber-orders/page.tsx` | Show products from `details` expand |
| 12 | `src/app/(dashboard)/supplier/orders/page.tsx` | Show products from `details` expand |
| 13 | `src/app/(dashboard)/supplier/orders/page.tsx` | Sheet detail: show all items |
| 14 | `pb_hooks/woodloop.pb.js` | Hook 6: iterate details, validate prices, decrease stock |
| 15 | `docs/07-skema.md` | Update schema docs |

---

## Key Logic

### Price Security (Hook 6 — server-side)
1. On `raw_timber_orders` create, fetch all `raw_timber_order_details` for this order
2. Untuk setiap detail: re-fetch `raw_timber_listings` → ambil `price` dari server
3. **Update** `detail.unit_price` ke harga server (user-friendly — tidak cancel)
4. Hitung ulang `detail.subtotal` dan `order.total_price`
5. Jika stok < quantity → cancel order + notifikasi

### Cart Store (`timber-cart-store.ts`)
- Zustand + `persist` middleware → `localStorage` key `woodloop-timber-cart`
- Items: `{ listing_id, listing_name, unit_price, quantity, supplier_id, supplier_name, wood_type_name, photo_url? }`
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getGroupedBySupplier`, `getGrandTotal`
- `unit_price` di-store saat add (untuk display), tapi server override di checkout

### Checkout Flow
```
[Cart] → [Checkout] → for each supplier group:
  1. Create raw_timber_orders (master) via useCreateTimberOrderFromCart
  2. Create raw_timber_order_details (N records) via PB API
→ clearCart() + redirect to /generator/timber-orders
```

---

## Verification
1. `npm run migrate` — create `raw_timber_order_details`, backfill existing orders
2. `npx tsc --noEmit` — 0 errors (app code only)
3. `npx vitest run` — all tests pass
4. Manual: add items to cart, verify localStorage persists across page refresh
5. Manual: checkout, verify order + details created in PB
6. Manual: supplier sees multi-item order in their orders page
7. Manual: try sending wrong price in checkout → server overrides to correct price
