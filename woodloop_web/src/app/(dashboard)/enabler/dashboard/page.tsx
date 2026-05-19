import { DashboardWelcome } from "@/components/layout/dashboard-welcome";

const roleInfo = {
  title: "Dashboard Enabler",
  description: "Pantau dampak lingkungan, lihat statistik, dan kelola pengguna platform.",
  features: [
    { icon: "📊", label: "Dampak Lingkungan", desc: "CO2 terselamatkan, limbah terkelola" },
    { icon: "👥", label: "Manajemen User", desc: "Kelola dan verifikasi pengguna" },
  ],
};

export default function EnablerDashboard() {
  return <DashboardWelcome info={roleInfo} />;
}
