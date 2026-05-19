"use client";

import dynamic from "next/dynamic";

const AggregatorDashboardContent = dynamic(
  () => import("@/components/features/aggregator-dashboard-content"),
  { ssr: false }
);

export default function AggregatorDashboardPage() {
  return <AggregatorDashboardContent />;
}
