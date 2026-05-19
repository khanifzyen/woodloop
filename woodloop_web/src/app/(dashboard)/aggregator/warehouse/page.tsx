"use client";

import { useState } from "react";
import { useWarehouseInventory, useUpdateInventoryPrice } from "@/lib/hooks/use-aggregator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input as InputNumber } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WarehouseIcon, DollarSignIcon, PackageIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function WarehousePage() {
  const { data, isLoading } = useWarehouseInventory();
  const updatePrice = useUpdateInventoryPrice();
  const [statusFilter, setStatusFilter] = useState("all");

  const items = data?.items ?? [];
  const filteredItems = statusFilter === "all" ? items : items.filter((i) => i.status === statusFilter);

  const totalWeight = filteredItems.reduce((sum, i) => sum + (i.weight || 0), 0);
  const totalValue = filteredItems.reduce((sum, i) => sum + ((i.price_per_kg || 0) * (i.weight || 0)), 0);

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    in_stock: { label: "Dalam Stok", variant: "default" },
    reserved: { label: "Dipesan", variant: "secondary" },
    sold: { label: "Terjual", variant: "outline" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Gudang</h1>
          <p className="text-muted-foreground mt-1">Kelola stok limbah di gudang</p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/aggregator/warehouse/log">
            <PackageIcon className="h-4 w-4" />
            Log Inventori
          </Link>
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <WarehouseIcon className="h-4 w-4" />
              <span className="text-sm">Total Berat</span>
            </div>
            <p className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSignIcon className="h-4 w-4" />
              <span className="text-sm">Total Nilai</span>
            </div>
            <p className="text-2xl font-bold">
              Rp {totalValue.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="in_stock">Dalam Stok</SelectItem>
            <SelectItem value="reserved">Dipesan</SelectItem>
            <SelectItem value="sold">Terjual</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {filteredItems.length} item
        </p>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <WarehouseIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">Belum ada stok di gudang</p>
            <p className="text-sm text-muted-foreground mt-1">
              Stok akan muncul setelah pickup selesai dikonfirmasi
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Kayu</TableHead>
                <TableHead>Bentuk</TableHead>
                <TableHead>Berat (kg)</TableHead>
                <TableHead>Harga/kg (Rp)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.expand?.wood_type?.name || "-"}
                  </TableCell>
                  <TableCell>{item.form}</TableCell>
                  <TableCell>{item.weight}</TableCell>
                  <TableCell>
                    {item.status === "in_stock" ? (
                      <div className="flex items-center gap-1">
                        <InputNumber
                          type="number"
                          className="h-8 w-24"
                          defaultValue={item.price_per_kg || ""}
                          placeholder="0"
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (val > 0 && val !== item.price_per_kg) {
                              updatePrice.mutate(
                                { id: item.id, price_per_kg: val },
                                { onSuccess: () => toast.success("Harga diperbarui") }
                              );
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <span>{item.price_per_kg ? `Rp ${item.price_per_kg.toLocaleString("id-ID")}` : "-"}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusMap[item.status]?.variant as "default" | "secondary" | "outline" | "destructive"}>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.price_per_kg
                      ? `Rp ${((item.price_per_kg || 0) * (item.weight || 0)).toLocaleString("id-ID")}`
                      : "-"}
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
