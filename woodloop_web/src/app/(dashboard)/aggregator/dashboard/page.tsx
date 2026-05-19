import { DashboardWelcome } from "@/components/layout/dashboard-welcome";

const roleInfo = {
  title: "Dashboard Aggregator",
  description: "Temukan limbah di peta, atur penjemputan, kelola gudang, dan ikuti lelang.",
  features: [
    { icon: "🗺️", label: "Peta Harta Karun", desc: "Lokasi limbah di sekitarmu" },
    { icon: "🚚", label: "Penjemputan", desc: "Atur jadwal pickup" },
    { icon: "🏭", label: "Gudang", desc: "Kelola stok di gudang" },
  ],
};

export default function AggregatorDashboard() {
  return <DashboardWelcome info={roleInfo} />;
}
