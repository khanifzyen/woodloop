"use client";

import { useState, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useWasteListingsForMap, useWoodTypes, useCreatePickup } from "@/lib/hooks/use-aggregator";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FilterIcon,
  CrosshairIcon,
  MapPinIcon,
  AlertTriangleIcon,
  TruckIcon,
  GavelIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Custom marker icons by urgency ──────────────────────────────────────
function createMarkerIcon(color: string, label: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background:${color}; color:white; width:32px; height:32px;
      border-radius:50%; display:flex; align-items:center; justify-content:center;
      font-size:14px; font-weight:bold; border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
    ">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

const ICON_AVAILABLE = createMarkerIcon("#22c55e", "●");
const ICON_URGENT = createMarkerIcon("#ef4444", "●");
const ICON_DEFAULT = createMarkerIcon("#eab308", "●");

// ─── Haversine distance (km) ─────────────────────────────────────────────
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Location Picker Component ───────────────────────────────────────────
function LocationMarker({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    map.locate({ setView: false, enableHighAccuracy: true });
    map.on("locationfound", (e: L.LocationEvent) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationFound(e.latlng.lat, e.latlng.lng);
    });
  }, [map, onLocationFound]);

  return position ? (
    <Marker
      position={position}
      icon={L.divIcon({
        className: "user-location-marker",
        html: `<div style="
          width:20px; height:20px; background:#3b82f6; border:3px solid white;
          border-radius:50%; box-shadow:0 0 0 3px rgba(59,130,246,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })}
    >
      <Popup>Lokasi Anda</Popup>
    </Marker>
  ) : null;
}

// ─── Map Controller ──────────────────────────────────────────────────────
function MapController({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

// ─── Main Treasure Map Component ─────────────────────────────────────────
export default function TreasureMap() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedWaste, setSelectedWaste] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([-6.58, 110.67]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.58, 110.67]);
  const [showFilters, setShowFilters] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [routeWastes, setRouteWastes] = useState<{ id: string; lat: number; lng: number; name: string; dist: number }[]>([]);
  const [filters, setFilters] = useState<{ wood_type?: string; form?: string; max_price?: number }>({});

  const { data, isLoading, error } = useWasteListingsForMap(filters);
  const { data: woodTypes } = useWoodTypes();

  const wasteItems = data?.items ?? [];

  // Urgency-based icon
  function getMarkerIcon(created: string) {
    const hoursAgo = (Date.now() - new Date(created).getTime()) / (1000 * 60 * 60);
    if (hoursAgo > 48) return ICON_URGENT;
    if (hoursAgo > 24) return ICON_DEFAULT;
    return ICON_AVAILABLE;
  }

  function getUrgencyLabel(created: string) {
    const hoursAgo = (Date.now() - new Date(created).getTime()) / (1000 * 60 * 60);
    if (hoursAgo > 48) return { label: "Urgent", variant: "destructive" as const };
    if (hoursAgo > 24) return { label: "> 24 jam", variant: "default" as const };
    return { label: "Baru", variant: "outline" as const };
  }

  const handleLocate = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setMapCenter(coords);
        },
        () => {
          setMapCenter([-6.58, 110.67]); // fallback ke Jepara
        }
      );
    }
  }, []);

  const handleToggleRoutes = useCallback(() => {
    if (!showRoutes) {
      // Calculate distances and pick top 3 nearest
      const withDist = wasteItems
        .map((w) => {
          const lat = w.expand?.generator?.location_lat;
          const lng = w.expand?.generator?.location_lng;
          if (!lat || !lng) return null;
          return {
            id: w.id,
            lat,
            lng,
            name: w.expand?.wood_type?.name || w.wood_type || "-",
            dist: haversineDistance(userLocation[0], userLocation[1], lat, lng),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a!.dist - b!.dist)
        .slice(0, 3);
      setRouteWastes(withDist as typeof routeWastes);
      setShowRoutes(true);
    } else {
      setShowRoutes(false);
      setRouteWastes([]);
    }
  }, [showRoutes, wasteItems, userLocation]);

  return (
    <div className="relative h-full">
      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} />
        <LocationMarker onLocationFound={(lat, lng) => setUserLocation([lat, lng])} />

        {isLoading ? null : (
          wasteItems.map((w) => {
            const woodName = w.expand?.wood_type?.name || w.wood_type;
            const lat = w.expand?.generator?.location_lat;
            const lng = w.expand?.generator?.location_lng;
            if (!lat || !lng) return null;
            return (
              <Marker
                key={w.id}
                position={[lat, lng]}
                icon={getMarkerIcon(w.created)}
                eventHandlers={{
                  click: () => setSelectedWaste(w),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium">{woodName}</p>
                    <p className="text-muted-foreground">{w.form} — {w.volume} {w.unit}</p>
                    <p className="font-semibold mt-1">
                      {w.price_estimate > 0
                        ? `Rp ${w.price_estimate.toLocaleString("id-ID")}`
                        : "Gratis"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })
        )}

        {/* Routing Polylines — rute ke 3 waste listing terdekat */}
        {showRoutes && routeWastes.map((rw, i) => (
          <Polyline
            key={rw.id}
            positions={[
              [userLocation[0], userLocation[1]],
              [rw.lat, rw.lng],
            ]}
            color={["#3b82f6", "#10b981", "#f59e0b"][i]}
            weight={3}
            opacity={0.7}
          />
        ))}
      </MapContainer>

      {/* Route Info Overlay */}
      {showRoutes && routeWastes.length > 0 && (
        <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg border p-3 shadow-lg max-w-xs">
          <p className="text-xs font-medium mb-2">Rute Terdekat</p>
          <div className="space-y-1.5">
            {routeWastes.map((rw, i) => (
              <div key={rw.id} className="flex items-center gap-2 text-xs">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: ["#3b82f6", "#10b981", "#f59e0b"][i] }}>
                  {i + 1}
                </span>
                <span className="flex-1 truncate">{rw.name}</span>
                <span className="text-muted-foreground">{rw.dist.toFixed(1)} km</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            Total: {routeWastes.reduce((s, r) => s + r.dist, 0).toFixed(1)} km
          </p>
        </div>
      )}

      {/* Overlay Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="shadow-lg gap-2"
          onClick={handleLocate}
        >
          <CrosshairIcon className="h-4 w-4" />
          Lokasi Saya
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="shadow-lg gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon className="h-4 w-4" />
          Filter
          {Object.keys(filters).length > 0 && (
            <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs">
              {Object.keys(filters).length}
            </Badge>
          )}
        </Button>
        <Button
          variant={showRoutes ? "default" : "secondary"}
          size="sm"
          className="shadow-lg gap-2"
          onClick={handleToggleRoutes}
        >
          <MapPinIcon className="h-4 w-4" />
          {showRoutes ? "Sembunyikan Rute" : "Rute Terdekat"}
        </Button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-background/50">
          <div className="space-y-3 w-64">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-background/80">
          <Card className="max-w-sm">
            <CardContent className="pt-6 text-center">
              <AlertTriangleIcon className="h-10 w-10 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-medium">Gagal memuat peta</p>
              <p className="text-sm text-muted-foreground mt-1">
        Coba refresh halaman atau periksa koneksi Anda.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && wasteItems.length === 0 && !error && (
        <div className="absolute inset-0 z-[999] pointer-events-none flex items-center justify-center">
          <Card className="max-w-sm pointer-events-auto shadow-xl">
            <CardContent className="pt-6 text-center">
              <MapPinIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">Tidak ada limbah di sekitar</p>
              <p className="text-sm text-muted-foreground mt-1">
                Belum ada limbah yang tersedia. Coba lagi nanti.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filter Peta</SheetTitle>
            <SheetDescription>
              Saring limbah berdasarkan kriteria
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Jenis Kayu</Label>
              <Select
                value={filters.wood_type || "all"}
                onValueChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    wood_type: v === "all" ? undefined : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua jenis</SelectItem>
                  {woodTypes?.map((wt) => (
                    <SelectItem key={wt.id} value={wt.id}>
                      {wt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bentuk Limbah</Label>
              <Select
                value={filters.form || "all"}
                onValueChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    form: v === "all" ? undefined : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua bentuk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua bentuk</SelectItem>
                  <SelectItem value="offcut_large">Offcut Besar</SelectItem>
                  <SelectItem value="offcut_small">Offcut Kecil</SelectItem>
                  <SelectItem value="shaving">Serutan</SelectItem>
                  <SelectItem value="sawdust">Serbuk Gergaji</SelectItem>
                  <SelectItem value="logs_end">Potongan Kayu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Harga Maksimal (Rp)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.max_price || ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    max_price: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setFilters({})}
            >
              Reset Filter
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Detail Sheet */}
      <Sheet
        open={!!selectedWaste}
        onOpenChange={(open) => !open && setSelectedWaste(null)}
      >
        <SheetContent side="bottom" className="h-[60vh] sm:h-[50vh]">
          {selectedWaste && (
            <WasteDetail
              waste={selectedWaste}
              onClose={() => setSelectedWaste(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Waste Detail Bottom Sheet ───────────────────────────────────────────
function WasteDetail({
  waste,
  onClose,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waste: any;
  onClose: () => void;
}) {
  const w = waste as {
    id: string;
    form: string;
    volume: number;
    unit: string;
    price_estimate: number;
    description?: string;
    created: string;
    wood_type?: string;
    expand?: {
      wood_type?: { name: string };
      generator?: { name: string; location_lat?: number; location_lng?: number };
    };
  };

  const createPickup = useCreatePickup();

  const woodName = w.expand?.wood_type?.name || w.wood_type || "-";
  const generatorName = w.expand?.generator?.name || "-";

  const urgency =
    (Date.now() - new Date(w.created).getTime()) / (1000 * 60 * 60) > 48
      ? "destructive"
      : (Date.now() - new Date(w.created).getTime()) / (1000 * 60 * 60) > 24
      ? "default"
      : "outline";

  const urgencyLabel =
    (Date.now() - new Date(w.created).getTime()) / (1000 * 60 * 60) > 48
      ? "Urgent"
      : (Date.now() - new Date(w.created).getTime()) / (1000 * 60 * 60) > 24
      ? "> 24 jam"
      : "Baru";

  return (
    <div className="h-full overflow-y-auto">
      <SheetHeader className="mb-4">
        <SheetTitle className="flex items-center gap-2">
          {woodName}
          <Badge variant={urgency as "default" | "destructive" | "outline"}>
            {urgencyLabel}
          </Badge>
        </SheetTitle>
        <SheetDescription>
          Oleh {generatorName}
        </SheetDescription>
      </SheetHeader>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Bentuk</p>
          <p className="font-medium">{w.form}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Volume</p>
          <p className="font-medium">
            {w.volume} {w.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Estimasi Harga</p>
          <p className="font-medium">
            {w.price_estimate > 0
              ? `Rp ${w.price_estimate.toLocaleString("id-ID")}`
              : "Gratis"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Dibuat</p>
          <p className="font-medium text-sm">
            {new Date(w.created).toLocaleDateString("id-ID")}
          </p>
        </div>
      </div>

      {w.description && (
        <p className="text-sm text-muted-foreground mb-4">{w.description}</p>
      )}

      <div className="flex gap-2">
        <Button
          className="flex-1 gap-2"
          onClick={async () => {
            try {
              await createPickup.mutateAsync(w.id);
              onClose();
            } catch { /* handled by mutation */ }
          }}
          disabled={createPickup.isPending}
        >
          <TruckIcon className="h-4 w-4" />
          {createPickup.isPending ? "Memproses..." : "Ambil Langsung"}
        </Button>
        <Button variant="outline" className="flex-1 gap-2" asChild>
          <Link href={`/aggregator/bidding?waste=${w.id}`}>
            <GavelIcon className="h-4 w-4" />
            Ajukan Bid
          </Link>
        </Button>
      </div>
    </div>
  );
}
