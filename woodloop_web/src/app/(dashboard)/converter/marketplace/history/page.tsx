"use client";

import { useConverterTransactions } from "@/lib/hooks/use-converter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ClockIcon } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Menunggu", variant: "secondary" },
  paid: { label: "Dibayar", variant: "default" },
  shipped: { label: "Dikirim", variant: "default" },
  received: { label: "Diterima", variant: "outline" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};

export default function TransactionHistoryPage() {
  const { data, isLoading } = useConverterTransactions();
  const txs = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Riwayat Transaksi</h1>
        <p className="text-muted-foreground mt-1">Daftar pembelian bahan limbah</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : txs.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <ClockIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Belum ada transaksi</p>
          <p className="text-sm text-muted-foreground mt-1">Beli bahan di Pasar Bahan untuk memulai</p>
        </CardContent></Card>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Aggregator</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txs.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.expand?.inventory_item?.expand?.wood_type?.name || "-"}</TableCell>
                  <TableCell>{tx.expand?.seller?.name || tx.seller?.slice(0, 8)}</TableCell>
                  <TableCell>{tx.quantity} kg</TableCell>
                  <TableCell>Rp {tx.total_price.toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[tx.status]?.variant || "outline"}>
                      {statusMap[tx.status]?.label || tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(tx.created).toLocaleDateString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
