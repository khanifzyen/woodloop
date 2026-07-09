/**
 * Biometric Authentication Abstraction Layer
 *
 * Strategy: Capacitor Biometric (native) → PIN/Password fallback
 * Digunakan oleh: Wallet (akses saldo), Settings (keamanan)
 *
 * Catatan:
 * - @capacitor/biometric belum diinstall (opsional, hanya untuk native)
 *   Install: bun add @capacitor/biometric
 * - Web fallback selalu return success (PIN bisa ditambah di layer UI)
 */

// ===================================================================
// Types
// ===================================================================
export type BiometricType =
  | "fingerprint"
  | "face"
  | "iris"
  | "pin"
  | "none";

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometricType?: BiometricType;
}

export interface BiometricOptions {
  /** Judul dialog native */
  title?: string;
  /** Subtitle dialog native */
  subtitle?: string;
  /** Pesan cancel */
  cancelMessage?: string;
  /** Fallback PIN (web only) */
  fallbackPin?: string;
}

// ===================================================================
// Platform Detection
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

// ===================================================================
// Capacitor Biometric (Native)
// ===================================================================
async function biometricNative(
  options: BiometricOptions = {},
): Promise<BiometricResult> {
  try {
    const { Biometric } = await import(
      // @ts-expect-error — native-only module
      "@capacitor/biometric"
    );

    const available = await Biometric.checkBiometric();
    if (!available.isAvailable) {
      return biometricPinFallback(options);
    }

    const result = await Biometric.authenticate({
      title: options.title ?? "Verifikasi Identitas",
      subtitle: options.subtitle ?? "Gunakan sidik jari atau wajah Anda",
      cancelMessage: options.cancelMessage ?? "Batal",
    });

    return {
      success: result.authorized,
      biometricType: available.biometricType as BiometricType,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal autentikasi biometric",
    };
  }
}

// ===================================================================
// PIN/Password Fallback (Web)
// ===================================================================
export function biometricPinFallback(
  _options: BiometricOptions = {},
): Promise<BiometricResult> {
  // Web tidak support biometric, selalu return sukses dengan type "none"
  // Implementasi PIN sebenarnya bisa ditambahkan di komponen UI wallet
  return Promise.resolve({
    success: true,
    biometricType: "none",
  });
}

// ===================================================================
// Main API
// ===================================================================
/**
 * Authenticate via biometric (native) atau PIN (web fallback).
 */
export async function authenticateBiometric(
  options: BiometricOptions = {},
): Promise<BiometricResult> {
  if (isNativePlatform()) {
    return biometricNative(options);
  }
  return biometricPinFallback(options);
}

/**
 * Cek apakah biometric tersedia di device ini.
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (!isNativePlatform()) return false;
  try {
    const { Biometric } = await import(
      // @ts-expect-error — native-only module
      "@capacitor/biometric"
    );
    const result = await Biometric.checkAvailable();
    return result.isAvailable;
  } catch {
    return false;
  }
}