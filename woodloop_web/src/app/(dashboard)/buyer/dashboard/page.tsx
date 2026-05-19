import { DashboardWelcome } from "@/components/layout/dashboard-welcome";

const roleInfo = {
  title: "Dashboard Buyer",
  description: "Jelajahi produk daur ulang, lacak pesanan, dan lihat dampak lingkungan.",
  features: [
    { icon: "🏪", label: "Marketplace", desc: "Produk upcycled berkualitas" },
    { icon: "📋", label: "Pesanan Saya", desc: "Lacak status pesanan" },
  ],
};

export default function BuyerDashboard() {
  return <DashboardWelcome info={roleInfo} />;
}
