import { DashboardWelcome } from "@/components/layout/dashboard-welcome";

const roleInfo = {
  title: "Dashboard Converter",
  description: "Beli bahan limbah, buat produk daur ulang, dan dapatkan inspirasi desain.",
  features: [
    { icon: "🛍️", label: "Pasar Bahan", desc: "Cari bahan limbah berkualitas" },
    { icon: "🎨", label: "Katalog Produk", desc: "Kelola produk upcycled" },
    { icon: "📐", label: "Klinik Desain", desc: "Inspirasi dan resep desain" },
  ],
};

export default function ConverterDashboard() {
  return <DashboardWelcome info={roleInfo} />;
}
