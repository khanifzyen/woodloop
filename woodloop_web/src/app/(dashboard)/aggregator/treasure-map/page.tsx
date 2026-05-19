"use client";

import dynamic from "next/dynamic";

const TreasureMap = dynamic(() => import("@/components/features/treasure-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-muted/20 rounded-lg">
      <p className="text-muted-foreground">Memuat peta...</p>
    </div>
  ),
});

export default function TreasureMapPage() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -mt-6">
      <TreasureMap />
    </div>
  );
}
