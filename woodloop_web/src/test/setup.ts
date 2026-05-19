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
