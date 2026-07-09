/**
 * Geolocation Abstraction Layer
 *
 * Strategy: Capacitor Geolocation → Browser Geolocation API
 * Digunakan oleh: Aggregator (Treasure Map), Register (auto-fill lokasi),
 *                Pickup (capture koordinat)
 */

// ===================================================================
// Types
// ===================================================================
export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number; // ms
  maximumAge?: number; // ms
}

// ===================================================================
// Platform Detection
// ===================================================================
function isCapacitorNative(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__CAPACITOR__ !== undefined
    );
  } catch {
    return false;
  }
}

// ===================================================================
// Capacitor Geolocation (Native)
// ===================================================================
async function getCurrentPositionNative(
  options: GeolocationOptions = {},
): Promise<Coordinates> {
  const { Geolocation } = await import("@capacitor/geolocation");

  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: options.enableHighAccuracy ?? true,
    timeout: options.timeout ?? 10000,
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy ?? undefined,
    altitude: position.coords.altitude,
    altitudeAccuracy: position.coords.altitudeAccuracy,
    heading: position.coords.heading,
    speed: position.coords.speed,
  };
}

// ===================================================================
// Browser Geolocation API (Web Fallback)
// ===================================================================
async function getCurrentPositionWeb(
  options: GeolocationOptions = {},
): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
        });
      },
      (error) => {
        const messages: Record<number, string> = {
          [error.PERMISSION_DENIED]: "Izin lokasi ditolak",
          [error.POSITION_UNAVAILABLE]: "Lokasi tidak tersedia",
          [error.TIMEOUT]: "Waktu permintaan lokasi habis",
        };
        reject(new Error(messages[error.code] ?? "Gagal mendapatkan lokasi"));
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0,
      },
    );
  });
}

// ===================================================================
// Main API
// ===================================================================
/**
 * Ambil posisi GPS saat ini.
 */
export async function getCurrentPosition(
  options: GeolocationOptions = {},
): Promise<Coordinates> {
  if (isCapacitorNative()) {
    return getCurrentPositionNative(options);
  }
  return getCurrentPositionWeb(options);
}

/**
 * Mulai watch posisi (real-time tracking).
 * Returns cleanup function.
 */
export function watchPosition(
  onPositionCallback: (coords: Coordinates) => void,
  onError?: (error: Error) => void,
  options: GeolocationOptions = {},
): () => void {
  if (isCapacitorNative()) {
    return startNativeWatch(onPositionCallback, onError, options);
  }
  return startWebWatch(onPositionCallback, onError, options);
}

function startNativeWatch(
  onPositionCallback: (coords: Coordinates) => void,
  onError?: (error: Error) => void,
  options: GeolocationOptions = {},
): () => void {
  let cancelled = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cleanup: (() => void) | undefined;

  (async () => {
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: options.enableHighAccuracy ?? true,
          timeout: options.timeout ?? 10000,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (position: any, err?: any) => {
          if (cancelled) return;
          if (err) {
            onError?.(new Error(err.message));
            return;
          }
          if (position) {
            onPositionCallback({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy ?? undefined,
            });
          }
        },
      );

      cleanup = () => {
        cancelled = true;
        Geolocation.clearWatch({ id: watchId });
      };
    } catch (e) {
      onError?.(e as Error);
    }
  })();

  return () => {
    cancelled = true;
    cleanup?.();
  };
}

function startWebWatch(
  onPositionCallback: (coords: Coordinates) => void,
  onError?: (error: Error) => void,
  options: GeolocationOptions = {},
): () => void {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onPositionCallback({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      const messages: Record<number, string> = {
        [error.PERMISSION_DENIED]: "Izin lokasi ditolak",
        [error.POSITION_UNAVAILABLE]: "Lokasi tidak tersedia",
        [error.TIMEOUT]: "Waktu habis",
      };
      onError?.(new Error(messages[error.code] ?? "Gagal watch lokasi"));
    },
    {
      enableHighAccuracy: options.enableHighAccuracy ?? true,
      timeout: options.timeout ?? 10000,
      maximumAge: options.maximumAge ?? 5000,
    },
  );

  return () => navigator.geolocation.clearWatch(watchId);
}

/**
 * Hitung jarak antara 2 koordinat (Haversine).
 * @returns jarak dalam kilometer
 */
export function haversineDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format jarak untuk ditampilkan ke user.
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}