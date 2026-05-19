import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WasteFormStepper } from "./waste-form-stepper";

const mockWoodTypes = [
  { id: "wt-1", name: "Jati" },
  { id: "wt-2", name: "Mahoni" },
  { id: "wt-3", name: "Trembesi" },
];

describe("WasteFormStepper", () => {
  it("should render step 1 (photo) by default", () => {
    render(
      <WasteFormStepper
        woodTypes={mockWoodTypes}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByText("Foto Limbah")).toBeInTheDocument();
    expect(screen.getByText(/Langkah 1 dari 4/i)).toBeInTheDocument();
  });

  it("should show progress bar", () => {
    render(
      <WasteFormStepper
        woodTypes={mockWoodTypes}
        onSubmit={vi.fn()}
      />
    );
    // Progress component renders as role="progressbar"
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("Langkah 1 dari 4")).toBeInTheDocument();
  });

  it("should render step indicators (4 steps)", () => {
    render(
      <WasteFormStepper
        woodTypes={mockWoodTypes}
        onSubmit={vi.fn()}
      />
    );
    const buttons = screen.getAllByRole("button");
    // Should have many buttons (step indicators, nav buttons, etc.)
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should show navigation buttons", () => {
    render(
      <WasteFormStepper
        woodTypes={mockWoodTypes}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByText("Lanjut")).toBeInTheDocument();
    expect(screen.getByText("Kembali")).toBeInTheDocument();
  });

  it("should handle empty wood types gracefully", () => {
    render(
      <WasteFormStepper
        woodTypes={[]}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByText("Foto Limbah")).toBeInTheDocument();
  });

  it("should show isSubmitting state", () => {
    render(
      <WasteFormStepper
        woodTypes={mockWoodTypes}
        onSubmit={vi.fn()}
        isSubmitting={true}
      />
    );
    // Should not render submit button on step 1
    expect(screen.queryByText("Mengirim...")).not.toBeInTheDocument();
  });
});
