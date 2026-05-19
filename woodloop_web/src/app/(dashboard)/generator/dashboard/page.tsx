import { DashboardWelcome } from "@/components/layout/dashboard-welcome";

const roleInfo = {
  title: "Dashboard Generator",
  description: "Setor limbah kayu, beli bahan baku, dan kelola produk furniture Anda.",
  features: [
    { icon: "♻️", label: "Setor Limbah", desc: "Foto dan jual limbah kayu" },
    { icon: "🛒", label: "Beli Kayu", desc: "Cari dan beli kayu dari Supplier" },
    { icon: "🪑", label: "Produk Saya", desc: "Kelola produk furniture" },
  ],
};

export default function GeneratorDashboard() {
  return <DashboardWelcome info={roleInfo} />;
}
