"use client";

import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SummaryCardItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendUp?: boolean;
  prefix?: string;
}

interface SummaryCardsProps {
  items: SummaryCardItem[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
}

function formatValue(val: string | number): string {
  if (typeof val === "number") {
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "jt";
    if (val >= 1_000) return (val / 1_000).toFixed(0) + "rb";
    return val.toLocaleString("id-ID");
  }
  return val;
}

export function SummaryCards({
  items,
  loading = false,
  columns = 4,
}: SummaryCardsProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid gap-4",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {Array.from({ length: items.length || 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div
        className={cn(
          "grid gap-4",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                —
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">0</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {item.prefix}
                {formatValue(item.value)}
              </div>
              {item.trend !== undefined && (
                <p
                  className={cn(
                    "text-xs mt-1",
                    item.trendUp
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
                  {item.trendUp ? "↑" : "↓"} {Math.abs(item.trend)}%
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
