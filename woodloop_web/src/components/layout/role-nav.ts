import {
  LayoutDashboard,
  ClipboardList,
  Package,
  ShoppingCart,
  TrendingUp,
  Map,
  Truck,
  Warehouse,
  Hammer,
  Store,
  Palette,
  BookOpen,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { NavItem } from "./sidebar";

type RoleNav = {
  sidebar: NavItem[];
  title: string;
  icon: string;
};

const nav: Record<string, RoleNav> = {
  supplier: {
    title: "Supplier",
    icon: "🪵",
    sidebar: [
      { label: "Dashboard", href: "/supplier/dashboard", icon: LayoutDashboard },
      { label: "Inventaris Kayu", href: "/supplier/inventory", icon: Package },
      { label: "Pesanan Masuk", href: "/supplier/orders", icon: ClipboardList },
      { label: "Riwayat Penjualan", href: "/supplier/sales", icon: TrendingUp },
    ],
  },
  generator: {
    title: "Generator",
    icon: "🏭",
    sidebar: [
      { label: "Dashboard", href: "/generator/dashboard", icon: LayoutDashboard },
      { label: "Setor Limbah", href: "/generator/report-waste", icon: Truck },
      { label: "Beli Kayu", href: "/generator/buy-timber", icon: ShoppingCart },
      { label: "Produk Saya", href: "/generator/products", icon: Package },
      { label: "Pesanan Kayu", href: "/generator/timber-orders", icon: ClipboardList },
    ],
  },
  aggregator: {
    title: "Aggregator",
    icon: "🚚",
    sidebar: [
      { label: "Dashboard", href: "/aggregator/dashboard", icon: LayoutDashboard },
      { label: "Peta Harta Karun", href: "/aggregator/treasure-map", icon: Map },
      { label: "Penjemputan", href: "/aggregator/pickups", icon: Truck },
      { label: "Gudang", href: "/aggregator/warehouse", icon: Warehouse },
      { label: "Lelang", href: "/aggregator/bidding", icon: Hammer },
    ],
  },
  converter: {
    title: "Converter",
    icon: "🎨",
    sidebar: [
      { label: "Dashboard", href: "/converter/dashboard", icon: LayoutDashboard },
      { label: "Pasar Bahan", href: "/converter/marketplace/materials", icon: Store },
      { label: "Katalog Produk", href: "/converter/catalog", icon: Package },
      { label: "Klinik Desain", href: "/converter/design-clinic", icon: BookOpen },
    ],
  },
  enabler: {
    title: "Enabler",
    icon: "📊",
    sidebar: [
      { label: "Dashboard", href: "/enabler/dashboard", icon: LayoutDashboard },
      { label: "Manajemen User", href: "/enabler/users", icon: Users },
    ],
  },
  buyer: {
    title: "Buyer",
    icon: "🛍️",
    sidebar: [
      { label: "Marketplace", href: "/buyer/marketplace", icon: Store },
      { label: "Pesanan Saya", href: "/buyer/orders", icon: ClipboardList },
    ],
  },
};

export function getRoleNav(role: string | null | undefined): RoleNav {
  return nav[role || ""] || {
    title: "Dashboard",
    icon: "🌳",
    sidebar: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  };
}
