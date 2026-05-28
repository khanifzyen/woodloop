"use client";

import { useState, useCallback } from "react";
import {
  useBids,
  useAvailableWasteForBid,
  useCreateBid,
  useWoodTypes,
} from "@/lib/hooks/use-aggregator";
import { useRealtimeSubscription } from "@/lib/hooks/use-realtime";
import { useQueryClient } from "@tanstack/react-query";
import { aggregatorKeys } from "@/lib/hooks/use-aggregator";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GavelIcon, DollarSignIcon, ClockIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Bid } from "@/lib/pocketbase/types";

export default function BiddingPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState("available");
  const { data: availableWaste, isLoading: loadingWaste } = useAvailableWasteForBid();
  const { data: myBids, isLoading: loadingBids } = useBids();
  const createBid = useCreateBid();

  // Real-time subscription: listen to bid status changes
  useRealtimeSubscription<Bid>(
    "bids",
    "*",
    useCallback((event) => {
      if (event.action === "update") {
        const bid = event.record;
        if (bid.status === "accepted") {
          toast.success("Tawaran Diterima!", {
            description: `Bid Anda untuk limbah kayu diterima. Buat jadwal penjemputan sekarang.`,
            action: {
              label: "Lihat Pickup",
              onClick: () => window.location.href = "/aggregator/pickups",
            },
            duration: 8000,
          });
          qc.invalidateQueries({ queryKey: aggregatorKeys.bids() });
          qc.invalidateQueries({ queryKey: aggregatorKeys.dashboard() });
        } else if (bid.status === "rejected") {
          toast.info("Tawaran Ditolak", {
            description: `Bid Anda untuk limbah kayu ditolak. Coba bid yang lain.`,
            duration: 5000,
          });
          qc.invalidateQueries({ queryKey: aggregatorKeys.bids() });
        }
      }
    }, [qc]),
  );

  const [bidDialog, setBidDialog] = useState<{ open: boolean; wasteId: string; woodName: string; priceEstimate: number }>({
    open: false, wasteId: "", woodName: "", priceEstimate: 0,
  });
  const [bidAmount, setBidAmount] = useState(0);
  const [bidMessage, setBidMessage] = useState("");

  function openBidDialog(wasteId: string, woodName: string, priceEstimate: number) {
    setBidDialog({ open: true, wasteId, woodName, priceEstimate });
    setBidAmount(priceEstimate);
    setBidMessage("");
  }

  async function handleSubmitBid() {
    if (bidAmount < bidDialog.priceEstimate) {
      toast.error(`Bid minimal Rp ${bidDialog.priceEstimate.toLocaleString("id-ID")}`);
      return;
    }
    try {
      await createBid.mutateAsync({
        waste_listing: bidDialog.wasteId,
        bid_amount: bidAmount,
        message: bidMessage || undefined,
      });
      toast.success("Bid berhasil diajukan!");
      setBidDialog({ open: false, wasteId: "", woodName: "", priceEstimate: 0 });
    } catch {
      toast.error("Gagal mengajukan bid");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Lelang</h1>
        <p className="text-muted-foreground mt-1">Ajukan tawaran untuk limbah yang tersedia</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="available">Lelang Tersedia</TabsTrigger>
          <TabsTrigger value="mine">Bid Saya</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-4">
          {loadingWaste ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : !availableWaste?.items?.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <GavelIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">Tidak ada lelang tersedia</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Belum ada limbah yang bisa dibid saat ini
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availableWaste.items.map((w) => {
                const woodName = w.expand?.wood_type?.name || w.wood_type;
                const genName = w.expand?.generator?.name || "-";
                return (
                  <Card key={w.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{woodName}</p>
                          <p className="text-sm text-muted-foreground">
                            {w.form} • {w.volume} {w.unit}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          Rp {(w.price_estimate || 0).toLocaleString("id-ID")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        Oleh {genName}
                      </p>
                      <Button
                        className="w-full gap-2"
                        variant="default"
                        onClick={() => openBidDialog(w.id, woodName || w.wood_type, w.price_estimate || 0)}
                      >
                        <GavelIcon className="h-4 w-4" />
                        Ajukan Bid
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine" className="mt-4">
          {loadingBids ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : !myBids?.items?.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ClockIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">Belum ada bid</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ajukan bid pada lelang yang tersedia
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myBids.items.map((b) => {
                const woodName = b.expand?.waste_listing?.expand?.wood_type?.name || "-";
                const statusVariant = b.status === "accepted" ? "default" as const : b.status === "rejected" ? "destructive" as const : "secondary" as const;
                return (
                  <Card key={b.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{woodName}</p>
                          <p className="text-sm text-muted-foreground">
                            Bid: Rp {(b.bid_amount || 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <Badge variant={statusVariant}>{b.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Bid Dialog */}
      <Dialog open={bidDialog.open} onOpenChange={(open) => setBidDialog((d) => ({ ...d, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajukan Bid</DialogTitle>
            <DialogDescription>
              {bidDialog.woodName} — Estimasi: Rp {bidDialog.priceEstimate.toLocaleString("id-ID")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bid-amount">
                Jumlah Bid (min Rp {bidDialog.priceEstimate.toLocaleString("id-ID")})
              </Label>
              <Input
                id="bid-amount"
                type="number"
                min={bidDialog.priceEstimate}
                value={bidAmount || ""}
                onChange={(e) => setBidAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bid-message">Pesan (opsional)</Label>
              <Textarea
                id="bid-message"
                placeholder="Sampaikan pesan ke Generator..."
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBidDialog((d) => ({ ...d, open: false }))}>
              Batal
            </Button>
            <Button onClick={handleSubmitBid} disabled={createBid.isPending}>
              {createBid.isPending ? "Mengirim..." : "Kirim Bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
