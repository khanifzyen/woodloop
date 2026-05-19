import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileDropzone } from "./file-dropzone";

describe("FileDropzone", () => {
  it("should render dropzone area", () => {
    render(
      <FileDropzone onFilesChange={vi.fn()} />
    );
    expect(
      screen.getByText(/Seret foto ke sini atau klik untuk upload/i)
    ).toBeInTheDocument();
  });

  it("should show file count info when maxFiles is set", () => {
    render(
      <FileDropzone onFilesChange={vi.fn()} maxFiles={3} />
    );
    expect(screen.getByText(/Maks 3 file/i)).toBeInTheDocument();
  });

  it("should render in document mode", () => {
    render(
      <FileDropzone
        onFilesChange={vi.fn()}
        documentMode
        accept=".pdf"
        maxFiles={1}
      />
    );
    expect(
      screen.getByText(/Upload dokumen legalitas/i)
    ).toBeInTheDocument();
  });

  it("should show existing previews when provided", () => {
    render(
      <FileDropzone
        onFilesChange={vi.fn()}
        initialFiles={["/test/photo.jpg"]}
      />
    );
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test/photo.jpg");
  });
});
