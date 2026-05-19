---
name: woodloop-design-system
description: WoodLoop design system — shadcn/ui + Tailwind CSS v4 + design tokens untuk aplikasi ekonomi sirkular kayu Jepara. Gunakan skill ini saat membuat halaman baru, komponen UI, atau layout.
---

# WoodLoop Design System

## Prinsip Desain

1. **Mobile-first** — Semua halaman harus responsif. Test di viewport 375px dulu baru 1440px.
2. **Accessible** — Gunakan semantic HTML, aria attributes, keyboard navigation.
3. **Gunakan shadcn/ui primitives** — Jangan buat custom component dari `<div>` jika shadcn/ui sudah punya. `npx shadcn@latest add <component>` untuk install.
4. **Design tokens** — Semua warna, spacing, font dari token. Jangan hardcode nilai.
5. **Dark mode** — Support via `class` strategy. Gunakan `dark:` prefix.

## Design Tokens

### Warna (Color Tokens)

```css
/* tailwind.config.ts */
:root {
  /* Primary — Hijau kayu alami */
  --primary: 142 76% 36%;        /* #2D6A4F */
  --primary-foreground: 0 0% 100%;

  /* Secondary — Coklat tanah */
  --secondary: 25 40% 36%;       /* #7D5A38 */
  --secondary-foreground: 0 0% 100%;

  /* Accent — Emas/kuning hangat */
  --accent: 38 92% 50%;          /* #F59E0B */
  --accent-foreground: 0 0% 100%;

  /* Surface — Krem/putih alami */
  --background: 40 30% 98%;      /* #FAFAF9 */
  --foreground: 0 0% 13%;        /* #222222 */

  /* Card & Muted */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 13%;
  --muted: 40 15% 92%;           /* #EAE5DD */
  --muted-foreground: 0 0% 45%;

  /* Status */
  --success: 142 76% 36%;        /* Hijau */
  --warning: 38 92% 50%;         /* Kuning */
  --destructive: 0 84% 60%;      /* Merah */
  --info: 200 90% 50%;           /* Biru */
}

.dark {
  --background: 0 0% 10%;
  --foreground: 0 0% 93%;
  --card: 0 0% 15%;
  --card-foreground: 0 0% 93%;
  --muted: 0 0% 20%;
  --muted-foreground: 0 0% 65%;
}
```

### Tipografi

| Level | Font | Weight | Size (Desktop) | Size (Mobile) |
|-------|------|--------|----------------|---------------|
| Heading 1 | Space Grotesk | 700 | 2.5rem (40px) | 1.875rem (30px) |
| Heading 2 | Space Grotesk | 600 | 2rem (32px) | 1.5rem (24px) |
| Heading 3 | Space Grotesk | 600 | 1.5rem (24px) | 1.25rem (20px) |
| Body | Inter | 400 | 1rem (16px) | 0.938rem (15px) |
| Small | Inter | 400 | 0.875rem (14px) | 0.813rem (13px) |
| Caption | Inter | 400 | 0.75rem (12px) | 0.75rem (12px) |

```css
/* tailwind.config.ts */
fontFamily: {
  heading: ['Space Grotesk', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

### Spacing

Gunakan grid 4px dari Tailwind (sudah default). Jangan pakai margin/padding ganjil.

| Scale | Tailwind | Pixels |
|-------|----------|--------|
| xs | `p-1` | 4px |
| sm | `p-2` | 8px |
| md | `p-4` | 16px |
| lg | `p-6` | 24px |
| xl | `p-8` | 32px |
| 2xl | `p-12` | 48px |

### Border Radius

| Level | Tailwind | Usage |
|-------|----------|-------|
| Button | `rounded-md` | 6px |
| Card | `rounded-lg` | 8px |
| Modal/Dialog | `rounded-xl` | 12px |
| Badge | `rounded-full` | Pill |

### Shadow

| Level | Tailwind | Usage |
|-------|----------|-------|
| Card | `shadow-sm` | Default card |
| Dropdown | `shadow-md` | Popover, dropdown menu |
| Modal | `shadow-lg` | Dialog overlay |

## Komponen shadcn/ui yang Wajib Ada

Install semuanya di awal project:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add progress
npx shadcn@latest add alert
npx shadcn@latest add tooltip
npx shadcn@latest add breadcrumb
npx shadcn@latest add command        # Search bar
npx shadcn@latest add popover        # Harga, filter
npx shadcn@latest add carousel       # Galeri produk
npx shadcn@latest add chart          # Dashboard Enabler
npx shadcn@latest add data-table     # Tabel interaktif
npx shadcn@latest add stepper        # Multi-step form (custom)
```

## Layout Patterns

### Dashboard Layout (Supplier, Generator, Aggregator, Converter)

```
┌──────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────┐  │
│ │          │ │  Header (Breadcrumb + Notif)│  │
│ │  Sidebar │ ├────────────────────────────┤  │
│ │  (Nav)   │ │                            │  │
│ │          │ │  Main Content              │  │
│ │  - Home  │ │  ┌─────┐ ┌─────┐ ┌─────┐  │  │
│ │  - Fitur │ │  │Card │ │Card │ │Card │  │  │
│ │  - Lain  │ │  └─────┘ └─────┘ └─────┘  │  │
│ │          │ │                            │  │
│ └──────────┘ └────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

- Sidebar: `w-64` di desktop, `Sheet` (drawer) di mobile
- Header: `h-14` dengan breadcrumb + notification badge + avatar dropdown
- Content: `p-4 lg:p-6` dengan grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Marketplace Layout (Buyer, Converter Marketplace)

```
┌──────────────────────────────────────────────┐
│  Top Nav: Logo | Search | Cart | Profile     │
├──────────────────────────────────────────────┤
│  Filter Bar: Kategori | Harga | Jenis Kayu   │
├──────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │ Product │ │ Product │ │ Product │        │
│  │  Card   │ │  Card   │ │  Card   │        │
│  └─────────┘ └─────────┘ └─────────┘        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │ Product │ │ Product │ │ Product │        │
│  │  Card   │ │  Card   │ │  Card   │        │
│  └─────────┘ └─────────┘ └─────────┘        │
└──────────────────────────────────────────────┘
```

- Product Card: `shadcn Card` dengan `aspect-[4/3]` foto + price badge
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
- Search: `Command` (cmdk) component

### Treasure Map Layout (Aggregator)

```
┌──────────────────────────────────────────────┐
│  Map (Leaflet) — full height                  │
│                                               │
│  ┌────────────────┐                           │
│  │ 🟢 Available   │ ← Marker pin limbah       │
│  │ 🔴 Urgent (>24h)│                          │
│  └────────────────┘                           │
│                                               │
│  ┌──────────────┐ (Sheet from bottom)         │
│  │ Waste Detail │ ← Slide up on pin click     │
│  │ Foto | Vol   │                             │
│  │ Harga | Ambil│                             │
│  └──────────────┘                             │
└──────────────────────────────────────────────┘
```

- Map: Full height `h-[calc(100vh-4rem)]`
- Bottom Sheet: `Sheet` dengan `side="bottom"`
- Markers: Custom icons sesuai status limbah

### Public Traceability Page (QR Code)

```
┌──────────────────────────────────────────────┐
│  🌳  WoodLoop Traceability                    │
│                                               │
│  ┌────────────────────────────────────┐       │
│  │  📸 Foto Produk                    │       │
│  │  Nama: Meja Jati Minimalis        │       │
│  │  Harga: Rp 450.000                 │       │
│  └────────────────────────────────────┘       │
│                                               │
│  Perjalanan Produk:                            │
│  ┌────┐   ┌────┐   ┌────┐   ┌────┐            │
│  │ 🌲 │→  │ 🪵 │→  │ ♻️ │→  │ 🎨 │            │
│  │Kayu│   │Limb│   │Olah│   │Jadi│            │
│  │Utuh│   │  ah│   │  ul│   │    │            │
│  └────┘   └────┘   └────┘   └────┘            │
│  Supplier  Generator  Aggreg  Converter        │
│                                               │
│  Dampak Lingkungan:                            │
│  ✅ 2.5 kg CO2 terselamatkan                   │
│  ✅ 5 kg limbah terpakai                       │
└──────────────────────────────────────────────┘
```

- Full SSR (React Server Component) — no JavaScript needed
- Timeline: Custom component dengan `Stepper`
- Impact: `Badge` dengan icon

## Komponen Feature-Specific (Custom)

### Cards Summary (Dashboard)
Gunakan `shadcn Card` dengan icon + value + label:

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{formatCurrency(total)}</div>
    <p className="text-xs text-muted-foreground">
      +20.1% dari bulan lalu
    </p>
  </CardContent>
</Card>
```

### Waste Form (Generator)
Multi-step form dengan `Stepper`:

```tsx
// Step 1: Foto (Camera native atau upload)
// Step 2: Jenis kayu (Select + Search)
// Step 3: Volume & kondisi (Input + Select)
// Step 4: Estimasi harga (Input + Preview)
// Step 5: Konfirmasi (Summary + Submit)
```

### Treasure Map (Aggregator)
Leaflet map + Sheet bottom panel:

```tsx
<div className="relative h-[calc(100vh-4rem)]">
  <MapContainer center={[-6.58, 110.67]} zoom={13}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {wasteListings.map(w => (
      <Marker key={w.id} position={[w.lat, w.lng]}>
        <Popup>
          {/* Detail limbah */}
        </Popup>
      </Marker>
    ))}
  </MapContainer>
</div>
```

### Chat System
Custom chat bubble dengan `Avatar` + `Card`:

```tsx
<div className="flex gap-3 mb-4">
  <Avatar>
    <AvatarImage src={sender.avatar} />
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
  <div>
    <p className="text-sm font-medium">{sender.name}</p>
    <Card className="px-3 py-2">{message}</Card>
    <p className="text-xs text-muted-foreground">{time}</p>
  </div>
</div>
```

### QR Scanner (Buyer)
Full page scan dengan fallback upload:

```tsx
'use client';
import { Html5QrcodeScanner } from 'html5-qrcode';

export function QRScanner({ onScan }: { onScan: (code: string) => void }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });
    scanner.render(onScan, console.error);
    return () => scanner.clear();
  }, []);

  return (
    <div>
      <div id="reader" className="mx-auto max-w-sm" />
      <p className="text-sm text-muted-foreground text-center mt-4">
        Atau upload foto QR code
      </p>
      <Input type="file" accept="image/*" className="mt-2" />
    </div>
  );
}
```

## Aturan Penggunaan Pi Agent

Saat menggunakan Pi agent untuk generate kode:

1. **Component pertama**: Install dari shadcn/ui dulu: `npx shadcn@latest add <name>`
2. **Custom component**: Jika shadcn tidak punya, buat di `src/components/features/`
3. **Form**: Gunakan `react-hook-form` + `zod` untuk validasi. Template sudah ada di shadcn `Form`.
4. **Data table**: Gunakan `shadcn DataTable` + `@tanstack/react-table`
5. **Chart**: Gunakan `shadcn Chart` (recharts wrapper)
6. **Semua komponen** harus punya loading state (`Skeleton`), empty state, dan error state.
7. **Jangan import langsung dari `lucide-react`** — export ulang icon dari `src/components/ui/icon.tsx`
