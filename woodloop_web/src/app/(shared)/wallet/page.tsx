"use client";

import { useWalletBalance, useWalletTransactions } from "@/lib/hooks/use-wallet";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Wallet, ArrowUpDown, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function WalletPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const { data: balance, isLoading: balLoading } = useWalletBalance();
  const { data: txsData, isLoading: txsLoading } = useWalletTransactions();
  const storeBalance = useWalletStore((s) => s.balance);
  const [showBalance, setShowBalance] = useState(true);
  const txs = txsData?.items ?? [];

  // Sync balance from PB to store
  if (balance !== undefined && balance !== storeBalance) {
    useWalletStore.getState().updateBalance(balance - storeBalance);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="heading-2">Dompet Digital</h1></div>

      {/* Balance Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-8 pb-8 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <p className="text-sm opacity-80 mb-1">Saldo Tersedia</p>
          {balLoading ? (
            <Skeleton className="h-10 w-48 mx-auto bg-primary-foreground/20" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">
                {showBalance ? `Rp ${(balance ?? 0).toLocaleString("id-ID")}` : "Rp •••••"}
              </p>
              <Button variant="ghost" size="icon" className="text-primary-foreground/80"
                onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2" disabled>
          <ArrowUpDown className="h-4 w-4" /> Top Up
        </Button>
        <Button variant="outline" className="flex-1 gap-2" disabled>
          <ArrowUpDown className="h-4 w-4 rotate-180" /> Tarik Tunai
        </Button>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader><CardTitle>Riwayat Transaksi</CardTitle></CardHeader>
        <CardContent>
          {txsLoading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : txs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada transaksi</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txs.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-sm">{new Date(tx.created).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>
                      <span className={tx.type === "credit" ? "text-green-500" : "text-red-500"}>
                        {tx.type === "credit" ? "Kredit" : "Debit"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">Rp {tx.amount.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.description || "-"}</TableCell>
                    <TableCell className="text-sm">Rp {(tx.balance_after ?? 0).toLocaleString("id-ID")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
