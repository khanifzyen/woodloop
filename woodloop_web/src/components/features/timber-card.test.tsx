import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimberCard, TimberCardSkeleton } from "./timber-card";
import type { RawTimberListing, WoodType } from "@/lib/pocketbase/types";

const mockListing: RawTimberListing & {
  expand?: { wood_type?: WoodType };
} = {
  id: "tl-1",
  supplier: "supplier-1",
  wood_type: "wt-1",
  expand: {
    wood_type: { id: "wt-1", name: "Jati", carbon_factor: 0.5, created: "", updated: "" },
  },
  volume: 2.5,
  price: 1500000,
  unit: "m3",
  photos: ["/test/timber.jpg"],
  status: "available",
  description: "Kayu jati kualitas terbaik",
  created: "2026-01-01",
  updated: "2026-01-01",
};

describe("TimberCard", () => {
  it("should render listing data", () => {
    render(<TimberCard listing={mockListing} />);
    expect(screen.getByText("Jati")).toBeInTheDocument();
    expect(screen.getByText("2.5 m³")).toBeInTheDocument();
    expect(screen.getByText("m3")).toBeInTheDocument();
  });

  it("should render formatted price", () => {
    render(<TimberCard listing={mockListing} />);
    // Price: 1,500,000
    expect(screen.getByText(/Rp/)).toBeInTheDocument();
  });

  it("should render description", () => {
    render(<TimberCard listing={mockListing} />);
    expect(screen.getByText("Kayu jati kualitas terbaik")).toBeInTheDocument();
  });

  it("should render order button when onOrder provided", () => {
    render(<TimberCard listing={mockListing} onOrder={vi.fn()} />);
    expect(screen.getByText("Pesan Sekarang")).toBeInTheDocument();
  });

  it("should not render order button when onOrder not provided", () => {
    render(<TimberCard listing={mockListing} />);
    expect(screen.queryByText("Pesan Sekarang")).not.toBeInTheDocument();
  });

  it("should render fallback text when wood type not expanded", () => {
    const listingWithoutExpand = { ...mockListing, expand: undefined, wood_type: "unknown" };
    render(<TimberCard listing={listingWithoutExpand as typeof mockListing} />);
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });
});

describe("TimberCardSkeleton", () => {
  it("should render skeleton loading state", () => {
    const { container } = render(<TimberCardSkeleton />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
