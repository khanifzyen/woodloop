import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock Capacitor modules untuk test environment
vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isPluginAvailable: () => false,
    getPlatform: () => "web",
    isNativePlatform: () => false,
  },
}));

vi.mock("@capacitor/camera", () => ({
  Camera: {
    getPhoto: vi.fn(),
  },
  CameraResultType: { DataUrl: "dataurl" },
  CameraSource: { Camera: "camera" },
}));

// Mock localStorage untuk Zustand persist middleware
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Mock optional native-only Capacitor plugins (tidak terinstall di dev/test)
vi.mock("@capacitor-community/barcode-scanner", () => ({
  BarcodeScanner: { checkPermission: vi.fn(), hideBackground: vi.fn(), startScan: vi.fn(), showBackground: vi.fn(), Format: { QR_CODE: "QR_CODE" } },
}));
vi.mock("@capacitor/push-notifications", () => ({
  PushNotifications: { requestPermissions: vi.fn(), register: vi.fn(), addListener: vi.fn() },
}));
vi.mock("@capacitor/biometric", () => ({
  Biometric: { checkBiometric: vi.fn(), authenticate: vi.fn(), checkAvailable: vi.fn() },
}));
vi.mock("@capacitor/geolocation", () => ({
  Geolocation: { getCurrentPosition: vi.fn(), watchPosition: vi.fn(), clearWatch: vi.fn() },
}));
vi.mock("html5-qrcode", () => ({ Html5Qrcode: vi.fn() }));
