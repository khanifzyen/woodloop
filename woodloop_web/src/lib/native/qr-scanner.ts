/**
 * QR Scanner Abstraction Layer
 *
 * Strategy: Capacitor Barcode Scanner (native) → html5-qrcode (web fallback)
 * Digunakan oleh: Buyer (scan QR produk → track traceability)
 *
 * Catatan: Capacitor Barcode Scanner https://github.com/capacitor-community/barcode-scanner
 * belum diinstall. Untuk sekarang web fallback via html5-qrcode.
 */

// ===================================================================
// Types
// ===================================================================
export interface QRScanResult {
  /** Data yang terkandung dalam QR code (biasanya productId) */
  data: string;
  /** Format barcode */
  format?: string;
}

export interface QRScannerOptions {
  /** Preferred camera: "environment" (belakang) / "user" (depan) */
  preferredCamera?: "environment" | "user";
  /** Waktu tunggu scan (ms). 0 = terus-menerus */
  timeout?: number;
}

// ===================================================================
// Types (internal)
// ===================================================================
interface Html5QrCodeInstance {
  start: (
    cameraId: string,
    config: { fps: number; qrbox?: { width: number; height: number } },
    onSuccess: (text: string) => void,
    onError: (err: string) => void,
  ) => Promise<void>;
  stop: () => Promise<void>;
  clear: () => void;
}

interface Html5QrCodeStatic {
  new (
    elementId: string,
    config?: { formatsToSupport?: number[]; verbose?: boolean },
  ): Html5QrCodeInstance;
  getCameras: () => Promise<{ id: string; label: string }[]>;
}

// ===================================================================
// Capacitor Barcode Scanner (Native)
// ===================================================================
async function scanNative(
  options: QRScannerOptions,
): Promise<QRScanResult> {
  const { BarcodeScanner } = await import(
    // @ts-expect-error — native-only module
    "@capacitor-community/barcode-scanner"
  );

  // Minta permission
  const status = await BarcodeScanner.checkPermission({ force: true });
  if (!status.granted) {
    throw new Error("Izin kamera ditolak");
  }

  // Sembunyikan webview background (tampilkan kamera fullscreen)
  await BarcodeScanner.hideBackground();

  const result = await BarcodeScanner.startScan({
    targetedFormats: [BarcodeScanner.Format.QR_CODE],
  });

  await BarcodeScanner.showBackground();

  if (result.hasContent) {
    return {
      data: result.content!,
      format: "QR_CODE",
    };
  }

  throw new Error("Tidak ada QR code terdeteksi");
}

// ===================================================================
// html5-qrcode (Web Fallback)
// ===================================================================
async function scanWeb(
  options: QRScannerOptions,
): Promise<QRScanResult> {
  // Dynamic import untuk web fallback
  const Html5QrcodeModule: Html5QrCodeStatic = await import(
    // @ts-expect-error — html5-qrcode opsional
    "html5-qrcode"
  ).then(
    (m) => m.Html5Qrcode ?? m.default.Html5Qrcode,
  );

  // Buat elemen container sementara
  const containerId = `qr-scanner-${Date.now()}`;
  const container = document.createElement("div");
  container.id = containerId;
  container.style.width = "320px";
  container.style.height = "320px";
  container.style.display = "none";
  document.body.appendChild(container);

  const scanner = new Html5QrcodeModule(containerId);

  try {
    // Dapatkan kamera
    const cameras = await Html5QrcodeModule.getCameras();
    if (cameras.length === 0) {
      throw new Error("Tidak ada kamera tersedia");
    }

    const cameraId =
      options.preferredCamera === "user"
        ? cameras.find((c) => c.label.toLowerCase().includes("front"))
            ?.id ?? cameras[0].id
        : cameras.find((c) => c.label.toLowerCase().includes("back"))
          ?.id ?? cameras[0].id;

    // Scan
    const data = await new Promise<string>((resolve, reject) => {
      scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (text: string) => {
          resolve(text);
        },
        () => {
          // Ignore intermediate errors (fps noise)
        },
      );

      if (options.timeout && options.timeout > 0) {
        setTimeout(() => {
          scanner.stop().catch(() => {});
          reject(new Error("Waktu scan habis"));
        }, options.timeout);
      }
    });

    await scanner.stop();
    return { data, format: "QR_CODE" };
  } finally {
    // Bersihkan container
    container.remove();
  }
}

// ===================================================================
// Main API
// ===================================================================
function isNativePlatform(): boolean {
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

/**
 * Scan QR code.
 * - Native: Capacitor Barcode Scanner
 * - Web: html5-qrcode
 */
export async function scanQRCode(
  options: QRScannerOptions = {},
): Promise<QRScanResult> {
  if (isNativePlatform()) {
    return scanNative(options);
  }
  return scanWeb(options);
}

/**
 * Parse QR code data — extract product ID dari format QR WoodLoop.
 * Format QR: "PRD-XXXXXXXX" atau URL "/p/{qr_code_id}"
 */
export function parseQRData(data: string): {
  type: "product" | "traceability" | "unknown";
  id?: string;
} {
  // Format: PRD-XXXXXXXX (product ID)
  if (/^PRD-[A-Z0-9]{8}$/.test(data)) {
    return { type: "product", id: data };
  }

  // Format: URL /p/{qr_code_id}
  const pMatch = data.match(/\/p\/([A-Z0-9-]+)/);
  if (pMatch) {
    return { type: "traceability", id: pMatch[1] };
  }

  return { type: "unknown" };
}

/**
 * Cek apakah browser support kamera untuk QR scan.
 */
export function isCameraSupported(): boolean {
  return !!(
    typeof navigator !== "undefined" &&
    navigator.mediaDevices?.getUserMedia
  );
}