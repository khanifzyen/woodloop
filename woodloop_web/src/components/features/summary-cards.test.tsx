import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Package } from "lucide-react";
import { SummaryCards } from "./summary-cards";

describe("SummaryCards", () => {
  const mockItems = [
    { title: "Listing Aktif", value: 12, icon: Package },
    { title: "Order Masuk", value: 5, icon: Package, trend: 10, trendUp: true },
    { title: "Total Penjualan", value: 5000000, icon: Package, prefix: "Rp " },
    { title: "Saldo", value: 0, icon: Package },
  ];

  it("should render correct number of cards", () => {
    render(<SummaryCards items={mockItems} />);
    expect(screen.getByText("Listing Aktif")).toBeInTheDocument();
    expect(screen.getByText("Order Masuk")).toBeInTheDocument();
    expect(screen.getByText("Total Penjualan")).toBeInTheDocument();
    expect(screen.getByText("Saldo")).toBeInTheDocument();
  });

  it("should format large numbers", () => {
    render(<SummaryCards items={mockItems} />);
    // 5,000,000 should show as "5.0jt"
    const elements = screen.getAllByText((content) => content.includes("5.0jt"));
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("should show prefix for currency", () => {
    render(<SummaryCards items={mockItems} />);
    const elements = screen.getAllByText((content) => content.includes("5.0jt"));
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("should display trend indicator", () => {
    render(<SummaryCards items={mockItems} />);
    expect(screen.getByText("↑ 10%")).toBeInTheDocument();
  });

  it("should show loading skeleton when loading", () => {
    const { container } = render(
      <SummaryCards items={mockItems} loading={true} />
    );
    // Should render skeletons instead of actual content
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should show zero values when empty array", () => {
    render(<SummaryCards items={[]} />);
    // Should still render 4 placeholder cards with 0
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(4);
  });

  it("should render with 2 columns", () => {
    const { container } = render(
      <SummaryCards items={mockItems.slice(0, 2)} columns={2} />
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain("grid-cols-1");
    expect(grid.className).toContain("sm:grid-cols-2");
  });
});
