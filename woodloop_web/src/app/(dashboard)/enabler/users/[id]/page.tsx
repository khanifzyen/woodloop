"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, User as UserIcon, Activity, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  useUserDetail,
  useUserActivity,
  useUpdateUserVerification,
} from "@/lib/hooks/use-enabler";
import { DocumentManager } from "@/components/features/document-manager";

const ROLE_LABELS: Record<string, string> = {
  supplier: "Supplier",
  generator: "Generator",
  aggregator: "Aggregator",
  converter: "Converter",
  enabler: "Enabler",
  buyer: "Buyer",
  designer: "Desainer",
};

const ROLE_COLORS: Record<string, string> = {
  supplier: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  generator: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  aggregator: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  converter: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  enabler: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  buyer: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  designer: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: user, isLoading } = useUserDetail(id);
  const { data: activity } = useUserActivity(id);
  const verifyUser = useUpdateUserVerification();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <div><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32 mt-1" /></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/enabler/users"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <UserIcon className="h-10 w-10 mx-auto mb-3" />
          <p className="font-medium">User tidak ditemukan</p>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/enabler/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">{user.name}</h1>
          <p className="text-muted-foreground mt-1">Detail profil dan aktivitas pengguna</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={ROLE_COLORS[user.role] || ""}>
                  {ROLE_LABELS[user.role] || user.role}
                </Badge>
                {user.is_verified ? (
                  <Badge variant="default" className="bg-green-600">Terverifikasi</Badge>
                ) : (
                  <Badge variant="secondary">Belum Verifikasi</Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{user.email}</span></div>
                {user.phone && <div><span className="text-muted-foreground">Telepon:</span> <span className="font-medium">{user.phone}</span></div>}
                {user.workshop_name && <div><span className="text-muted-foreground">Workshop:</span> <span className="font-medium">{user.workshop_name}</span></div>}
                {user.address && <div><span className="text-muted-foreground">Alamat:</span> <span className="font-medium">{user.address}</span></div>}
                {user.user_code && <div><span className="text-muted-foreground">Kode User:</span> <span className="font-medium">{user.user_code}</span></div>}
                {user.production_capacity && <div><span className="text-muted-foreground">Kapasitas Produksi:</span> <span className="font-medium">{user.production_capacity}</span></div>}
                {user.machine_type && <div><span className="text-muted-foreground">Jenis Mesin:</span> <span className="font-medium">{user.machine_type}</span></div>}
                {user.fleet_type && <div><span className="text-muted-foreground">Armada:</span> <span className="font-medium">{user.fleet_type}</span></div>}
                {user.warehouse_capacity && <div><span className="text-muted-foreground">Kapasitas Gudang:</span> <span className="font-medium">{user.warehouse_capacity}</span></div>}
              </div>

              {(user.location_lat && user.location_lng) && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-1">Lokasi: {user.location_lat.toFixed(6)}, {user.location_lng.toFixed(6)}</p>
                </div>
              )}

              <Separator />

              {/* Verification Toggle */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Verifikasi Akun</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={user.is_verified ? "outline" : "default"}
                    className="gap-2"
                    onClick={() => {
                      if (!user.is_verified) {
                        verifyUser.mutate(
                          { userId: id, is_verified: true },
                          { onSuccess: () => toast.success("User diverifikasi") }
                        );
                      }
                    }}
                    disabled={user.is_verified || verifyUser.isPending}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verifikasi
                  </Button>
                  <Button
                    size="sm"
                    variant={user.is_verified ? "destructive" : "outline"}
                    className="gap-2"
                    onClick={() => {
                      if (user.is_verified) {
                        verifyUser.mutate(
                          { userId: id, is_verified: false },
                          { onSuccess: () => toast.success("Verifikasi dibatalkan") }
                        );
                      }
                    }}
                    disabled={!user.is_verified || verifyUser.isPending}
                  >
                    <ShieldX className="h-4 w-4" />
                    Batalkan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!activity ? (
                <Skeleton className="h-32" />
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Listing Limbah</span>
                    <span className="font-medium">{activity.wasteListings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Listing Kayu</span>
                    <span className="font-medium">{activity.timberListings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pesanan</span>
                    <span className="font-medium">{activity.orders}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Penjemputan</span>
                    <span className="font-medium">{activity.pickups}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dokumen Legalitas</span>
                    <span className="font-medium">{activity.documents}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Documents */}
        <div className="lg:col-span-2 space-y-6">
          <DocumentManager userId={id} userName={user.name} />
        </div>
      </div>
    </div>
  );
}
