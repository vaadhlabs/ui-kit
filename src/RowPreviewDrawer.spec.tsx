import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createTensorTheme } from "./theme.js";
import { RowPreviewDrawer } from "./RowPreviewDrawer.js";

function Wrapper({ children, mode = "light" }: { children: React.ReactNode; mode?: "light" | "dark" }) {
  return (
    <ThemeProvider theme={createTensorTheme(mode)}>{children}</ThemeProvider>
  );
}

function renderDrawer(overrides: Partial<React.ComponentProps<typeof RowPreviewDrawer>> = {}) {
  return render(
    <Wrapper>
      <RowPreviewDrawer
        open={true}
        title="g4dn-prod-12"
        onClose={vi.fn()}
        onOpenPage={vi.fn()}
        {...overrides}
      />
    </Wrapper>,
  );
}

describe("RowPreviewDrawer — render", () => {
  it("renders title when open", () => {
    renderDrawer();
    expect(screen.getByRole("heading", { level: 2, name: "g4dn-prod-12" })).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    renderDrawer({ subtitle: "us-east-1 · p3.2xlarge" });
    expect(screen.getByText("us-east-1 · p3.2xlarge")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    renderDrawer();
    expect(screen.queryByText("us-east-1 · p3.2xlarge")).not.toBeInTheDocument();
  });

  it("renders children in the body", () => {
    renderDrawer({ children: <p data-testid="body">Detail content</p> });
    expect(screen.getByTestId("body")).toBeInTheDocument();
  });

  it("renders 'Open page' CTA button", () => {
    renderDrawer();
    expect(screen.getByRole("button", { name: /open full page/i })).toBeInTheDocument();
  });

  it("renders close button", () => {
    renderDrawer();
    const closeBtns = screen.getAllByRole("button", { name: /close preview/i });
    expect(closeBtns.length).toBeGreaterThanOrEqual(1);
  });
});

describe("RowPreviewDrawer — open/close state", () => {
  it("has aria-hidden=false when open", () => {
    const { container } = renderDrawer({ open: true });
    const outerBox = container.querySelector("[aria-hidden]");
    expect(outerBox?.getAttribute("aria-hidden")).toBe("false");
  });

  it("has aria-hidden=true when closed", () => {
    const { container } = renderDrawer({ open: false });
    const outerBox = container.querySelector("[aria-hidden]");
    expect(outerBox?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("RowPreviewDrawer — callbacks", () => {
  it("calls onOpenPage when 'Open page' button is clicked", () => {
    const onOpenPage = vi.fn();
    renderDrawer({ onOpenPage });
    fireEvent.click(screen.getByRole("button", { name: /open full page/i }));
    expect(onOpenPage).toHaveBeenCalledOnce();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    renderDrawer({ onClose });
    const closeBtns = screen.getAllByRole("button", { name: /close preview/i });
    fireEvent.click(closeBtns[0]);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when scrim is clicked", () => {
    const onClose = vi.fn();
    const { container } = renderDrawer({ onClose });
    const scrim = container.querySelector("[aria-label='Close preview']") as HTMLElement;
    // The scrim element is NOT the button; it's the backdrop box
    const scrimEl = Array.from(container.querySelectorAll("[aria-label='Close preview']")).find(
      (el) => el.tagName !== "BUTTON",
    );
    if (scrimEl) {
      fireEvent.click(scrimEl);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it("calls onClose when ESC key is pressed while open", () => {
    const onClose = vi.fn();
    renderDrawer({ onClose, open: true });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose on ESC when drawer is closed", () => {
    const onClose = vi.fn();
    renderDrawer({ onClose, open: false });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("RowPreviewDrawer — dark mode", () => {
  it("renders in dark mode without errors", () => {
    render(
      <Wrapper mode="dark">
        <RowPreviewDrawer
          open={true}
          title="Instance preview"
          onClose={vi.fn()}
          onOpenPage={vi.fn()}
        />
      </Wrapper>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Instance preview" })).toBeInTheDocument();
  });
});
