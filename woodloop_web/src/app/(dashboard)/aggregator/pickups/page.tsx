"use client";

import { useState } from "react";
import { usePickups, useUpdatePickupStatus } from "@/lib/hooks/use-aggregator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Camera, MapPin, Scale, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PickupsPage() {
  const [tab, setTab] = useState("pending");
  const { data, isLoading } = usePickups({ status: tab === "all" ? undefined : tab });
  const updateStatus = useUpdatePickupStatus();

  const pickups = data?.items ?? [];

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    pending: { label: "Perlu Dijemput", variant: "default" },
    on_the_way: { label: "Sedang Diangkut", variant: "secondary" },
    completed: { label: "Selesai", variant: "outline" },
    cancelled: { label: "Dibatalkan", variant: "destructive" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Penjemputan</h1>
        <p className="text-muted-foreground mt-1">Atur dan konfirmasi penjemputan limbah</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">Perlu Dijemput</TabsTrigger>
          <TabsTrigger value="on_the_way">Sedang Diangkut</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
          <TabsTrigger value="all">Semua</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : pickups.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Belum ada penjemputan</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pickups.map((p) => (
                <PickupCard
                  key={p.id}
                  pickup={p}
                  onStatusChange={(status) => {
                    updateStatus.mutate({ id: p.id, status });
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PickupCard({
  pickup,
  onStatusChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pickup: any;
  onStatusChange: (status: "pending" | "on_the_way" | "completed" | "cancelled") => void;
}) {
  const router = useRouter();
  const p = pickup as {
    id: string;
    status: string;
    scheduled_date?: string;
    created: string;
    expand?: {
      waste_listing?: {
        form?: string;
        volume?: number;
        unit?: string;
        expand?: { wood_type?: { name: string } };
      };
    };
  };

  const wasteInfo = p.expand?.waste_listing;
  const woodName = wasteInfo?.expand?.wood_type?.name || "-";

  const progressMap: Record<string, number> = {
    pending: 25,
    on_the_way: 60,
    completed: 100,
    cancelled: 0,
  };

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium truncate">
                {woodName} — {wasteInfo?.form || "-"}
              </p>
              <Badge variant={p.status === "completed" ? "outline" : p.status === "on_the_way" ? "secondary" : "default"}>
                {p.status === "on_the_way" ? "Sedang Diangkut" : p.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {wasteInfo?.volume} {wasteInfo?.unit}
              {p.scheduled_date && ` • ${new Date(p.scheduled_date).toLocaleDateString("id-ID")}`}
            </p>
            <Progress value={progressMap[p.status] ?? 0} className="h-1.5 mt-2" />
          </div>
          <div className="flex gap-2 shrink-0">
            {p.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange("on_the_way")}
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Jemput
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => router.push(`/aggregator/pickups/${p.id}/confirm`)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Selesai
                </Button>
              </>
            )}
            {p.status === "on_the_way" && (
              <Button
                size="sm"
                variant="default"
                onClick={() => router.push(`/aggregator/pickups/${p.id}/confirm`)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Konfirmasi
              </Button>
            )}
            {(p.status === "pending" || p.status === "on_the_way") && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => onStatusChange("cancelled")}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
