import { describe, it, expect } from "vitest";

// ---- Geolocation utilities (pure functions, no mocks needed) ----
import { haversineDistance, formatDistance } from "./geolocation";

// ---- QR Scanner utilities ----
import { parseQRData } from "./qr-scanner";

// ---- Camera utilities ----
import { photoToFormData } from "./camera";

// ===================================================================
// Camera
// ===================================================================
describe("Camera", () => {
  it("photoToFormData creates FormData with file", () => {
    const file = new File(["test"], "photo.jpg", { type: "image/jpeg" });
    const fd = photoToFormData({
      dataUrl: "data:image/jpeg;base64,/9j/4AAQ",
      name: "photo.jpg",
      size: 1024,
      mimeType: "image/jpeg",
      file,
    });
    expect(fd.has("photos")).toBe(true);
    const blob = fd.get("photos") as File;
    expect(blob.name).toBe("photo.jpg");
  });

  it("photoToFormData uses custom field name", () => {
    const file = new File(["test"], "doc.pdf", { type: "application/pdf" });
    const fd = photoToFormData(
      {
        dataUrl: "data:application/pdf;base64,dGVzdA==",
        name: "doc.pdf",
        size: 4,
        mimeType: "application/pdf",
        file,
      },
      "legality_doc",
    );
    expect(fd.has("legality_doc")).toBe(true);
    expect(fd.has("photos")).toBe(false);
  });
});

// ===================================================================
// Geolocation
// ===================================================================
describe("Geolocation Utilities", () => {
  describe("haversineDistance", () => {
    it("returns 0 for same coordinate", () => {
      const d = haversineDistance({ lat: -6.58, lng: 110.67 }, { lat: -6.58, lng: 110.67 });
      expect(d).toBeCloseTo(0, 2);
    });

    it("calculates distance between Jepara and Semarang", () => {
      // Jepara ≈ -6.58, 110.67
      // Semarang ≈ -6.97, 110.42
      const d = haversineDistance(
        { lat: -6.58, lng: 110.67 },
        { lat: -6.97, lng: 110.42 },
      );
      expect(d).toBeGreaterThan(40); // ~48 km
      expect(d).toBeLessThan(55);
    });

    it("distance is commutative", () => {
      const a = { lat: -6.5, lng: 110.5 };
      const b = { lat: -7.0, lng: 111.0 };
      const d1 = haversineDistance(a, b);
      const d2 = haversineDistance(b, a);
      expect(d1).toBeCloseTo(d2, 5);
    });
  });

  describe("formatDistance", () => {
    it("formats < 1 km in meters", () => {
      expect(formatDistance(0.5)).toBe("500 m");
    });

    it("formats 1–10 km with one decimal", () => {
      expect(formatDistance(5.3)).toBe("5.3 km");
    });

    it("formats >= 10 km rounded", () => {
      expect(formatDistance(48.7)).toBe("49 km");
    });

    it("formats exactly 1 km as '1.0 km'", () => {
      expect(formatDistance(1)).toBe("1.0 km");
    });
  });
});

// ===================================================================
// QR Scanner
// ===================================================================
describe("QR Scanner Utilities", () => {
  describe("parseQRData", () => {
    it("parses PRD-XXXXXXXX format", () => {
      const result = parseQRData("PRD-ABCD1234");
      expect(result.type).toBe("product");
      expect(result.id).toBe("PRD-ABCD1234");
    });

    it("parses URL /p/{id} format", () => {
      const result = parseQRData("https://woodloop.pasarjepara.com/p/PRD-XYZ5678");
      expect(result.type).toBe("traceability");
      expect(result.id).toBe("PRD-XYZ5678");
    });

    it("returns unknown for invalid data", () => {
      const result = parseQRData("random-string");
      expect(result.type).toBe("unknown");
    });

    it("rejects invalid PRD format (wrong prefix)", () => {
      const result = parseQRData("XYZ-ABCD1234");
      expect(result.type).toBe("unknown");
    });

    it("rejects invalid PRD format (too short)", () => {
      const result = parseQRData("PRD-ABC");
      expect(result.type).toBe("unknown");
    });

    it("parses bare /p/ path", () => {
      const result = parseQRData("/p/PRD-12345678");
      expect(result.type).toBe("traceability");
      expect(result.id).toBe("PRD-12345678");
    });
  });
});
