// Mock modules for uninstalled native-only Capacitor plugins (test environment only)
// These are only ever imported dynamically behind isNativePlatform() = false guards.

export const BarcodeScanner = { checkPermission: () => {}, hideBackground: () => {}, startScan: () => {}, showBackground: () => {}, Format: { QR_CODE: "QR_CODE" } };
export const PushNotifications = { requestPermissions: () => {}, register: () => {}, addListener: () => {} };
export const Biometric = { checkBiometric: () => {}, authenticate: () => {}, checkAvailable: () => {} };
export const Html5Qrcode = class {};
