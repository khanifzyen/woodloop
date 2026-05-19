"use client";

import { useState } from "react";
import { useAllUsers, useUpdateUserVerification } from "@/lib/hooks/use-enabler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Users as UsersIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [role, setRole] = useState("all");
  const [verified, setVerified] = useState("all");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAllUsers({ role, search: search || undefined, verified: verified === "all" ? undefined : verified });
  const verifyUser = useUpdateUserVerification();
  const users = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div><h1 className="heading-2">Manajemen User</h1><p className="text-muted-foreground mt-1">Kelola dan verifikasi pengguna platform</p></div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama/email..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="generator">Generator</SelectItem>
            <SelectItem value="aggregator">Aggregator</SelectItem>
            <SelectItem value="converter">Converter</SelectItem>
            <SelectItem value="buyer">Buyer</SelectItem>
            <SelectItem value="enabler">Enabler</SelectItem>
          </SelectContent>
        </Select>
        <Select value={verified} onValueChange={setVerified}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="verified">Terverifikasi</SelectItem>
            <SelectItem value="unverified">Belum Verifikasi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : users.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <UsersIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Tidak ada user</p>
        </CardContent></Card>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Workshop</TableHead>
                <TableHead>Verifikasi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={(u as unknown as Record<string, string>).id}>
                  <TableCell className="font-medium">{(u as unknown as Record<string, string>).name}</TableCell>
                  <TableCell>{(u as unknown as Record<string, string>).email}</TableCell>
                  <TableCell><Badge variant="outline">{(u as unknown as Record<string, string>).role}</Badge></TableCell>
                  <TableCell>{(u as unknown as Record<string, string>).workshop_name || "-"}</TableCell>
                  <TableCell>
                    {(u as unknown as Record<string, boolean>).is_verified ? (
                      <Badge variant="default" className="bg-green-600">Terverifikasi</Badge>
                    ) : (
                      <Badge variant="secondary">Belum</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="gap-1"
                      onClick={() => {
                        const newStatus = !(u as unknown as Record<string, boolean>).is_verified;
                        verifyUser.mutate(
                          { userId: (u as unknown as Record<string, string>).id, is_verified: newStatus },
                          { onSuccess: () => toast.success(newStatus ? "User diverifikasi" : "Verifikasi dibatalkan") }
                        );
                      }}>
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
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
