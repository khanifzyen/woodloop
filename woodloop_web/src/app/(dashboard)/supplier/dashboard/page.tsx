import { DashboardWelcome } from "@/components/layout/dashboard-welcome";

const roleInfo = {
  supplier: {
    title: "Dashboard Supplier",
    description:
      "Kelola inventaris kayu gelondongan, pantau pesanan masuk, dan lihat riwayat penjualan Anda.",
    features: [
      { icon: "🪵", label: "Inventaris Kayu", desc: "Daftar dan kelola stok kayu Anda" },
      { icon: "📦", label: "Pesanan Masuk", desc: "Lihat pesanan dari Generator" },
      { icon: "💰", label: "Riwayat Penjualan", desc: "Lacak pendapatan Anda" },
    ],
  },
  generator: {
    title: "Dashboard Generator",
    description:
      "Setor limbah kayu, beli bahan baku, dan kelola produk furniture Anda.",
    features: [
      { icon: "♻️", label: "Setor Limbah", desc: "Foto dan jual limbah kayu" },
      { icon: "🛒", label: "Beli Kayu", desc: "Cari dan beli kayu dari Supplier" },
      { icon: "🪑", label: "Produk Saya", desc: "Kelola produk furniture" },
    ],
  },
  aggregator: {
    title: "Dashboard Aggregator",
    description:
      "Temukan limbah di peta, atur penjemputan, kelola gudang, dan ikuti lelang.",
    features: [
      { icon: "🗺️", label: "Peta Harta Karun", desc: "Lokasi limbah di sekitarmu" },
      { icon: "🚚", label: "Penjemputan", desc: "Atur jadwal pickup" },
      { icon: "🏭", label: "Gudang", desc: "Kelola stok di gudang" },
    ],
  },
  converter: {
    title: "Dashboard Converter",
    description:
      "Beli bahan limbah, buat produk daur ulang, dan dapatkan inspirasi desain.",
    features: [
      { icon: "🛍️", label: "Pasar Bahan", desc: "Cari bahan limbah berkualitas" },
      { icon: "🎨", label: "Katalog Produk", desc: "Kelola produk upcycled" },
      { icon: "📐", label: "Klinik Desain", desc: "Inspirasi dan resep desain" },
    ],
  },
  enabler: {
    title: "Dashboard Enabler",
    description:
      "Pantau dampak lingkungan, lihat statistik, dan kelola pengguna platform.",
    features: [
      { icon: "📊", label: "Dampak Lingkungan", desc: "CO2 terselamatkan, limbah terkelola" },
      { icon: "👥", label: "Manajemen User", desc: "Kelola dan verifikasi pengguna" },
    ],
  },
  buyer: {
    title: "Dashboard Buyer",
    description:
      "Jelajahi produk daur ulang, lacak pesanan, dan lihat dampak lingkungan.",
    features: [
      { icon: "🏪", label: "Marketplace", desc: "Produk upcycled berkualitas" },
      { icon: "📋", label: "Pesanan Saya", desc: "Lacak status pesanan" },
    ],
  },
};

type Role = keyof typeof roleInfo;

export default function SupplierDashboard() {
  return <DashboardWelcome info={roleInfo.supplier} />;
}
