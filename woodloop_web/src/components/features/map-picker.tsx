"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({
  className: "bg-transparent",
  html: '<div style="font-size:24px;line-height:1">📍</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface MapPickerProps {
  lat: number;
  lng: number;
  onMove: (lat: number, lng: number) => void;
}

function DraggableMarker({ lat, lng, onMove }: MapPickerProps) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      draggable
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          const pos = e.target.getLatLng();
          onMove(pos.lat, pos.lng);
        },
      }}
    />
  );
}

export default function MapPicker({ lat, lng, onMove }: MapPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
        Memuat peta...
      </div>
    );
  }

  return (
    <div className="h-48 rounded overflow-hidden border">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker lat={lat} lng={lng} onMove={onMove} />
      </MapContainer>
    </div>
  );
}
