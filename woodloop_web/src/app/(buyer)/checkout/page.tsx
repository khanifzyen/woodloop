"use client";

import { Suspense } from "react";
import { CheckoutContent } from "@/components/features/checkout-content";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /><Skeleton className="h-48 w-full" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
