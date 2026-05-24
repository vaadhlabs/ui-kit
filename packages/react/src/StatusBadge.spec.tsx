import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createTensorTheme } from "./theme.js";
import { StatusBadge } from "./StatusBadge.js";

function LightWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={createTensorTheme("light")}>{children}</ThemeProvider>
  );
}

function DarkWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={createTensorTheme("dark")}>{children}</ThemeProvider>
  );
}

describe("StatusBadge", () => {
  it("renders text for kind=ok", () => {
    render(
      <LightWrapper>
        <StatusBadge kind="ok" text="All healthy" />
      </LightWrapper>,
    );
    expect(screen.getByText("All healthy")).toBeInTheDocument();
  });

  it("renders text for kind=warn", () => {
    render(
      <LightWrapper>
        <StatusBadge kind="warn" text="Approaching limit" />
      </LightWrapper>,
    );
    expect(screen.getByText("Approaching limit")).toBeInTheDocument();
  });

  it("renders text for kind=info", () => {
    render(
      <LightWrapper>
        <StatusBadge kind="info" text="30d · $55k" />
      </LightWrapper>,
    );
    expect(screen.getByText("30d · $55k")).toBeInTheDocument();
  });

  it("renders text for kind=danger", () => {
    render(
      <LightWrapper>
        <StatusBadge kind="danger" text="Over budget" />
      </LightWrapper>,
    );
    expect(screen.getByText("Over budget")).toBeInTheDocument();
  });

  it("renders in dark theme without errors", () => {
    render(
      <DarkWrapper>
        <StatusBadge kind="ok" text="Healthy" />
      </DarkWrapper>,
    );
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("has role=status for screen reader announcements", () => {
    render(
      <LightWrapper>
        <StatusBadge kind="ok" text="Good" />
      </LightWrapper>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has aria-live=polite for value changes", () => {
    render(
      <LightWrapper>
        <StatusBadge kind="warn" text="Warning" />
      </LightWrapper>,
    );
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-live", "polite");
  });

  it("aria-label includes kind and text", () => {
    render(
      <LightWrapper>
        <StatusBadge kind="danger" text="Critical" />
      </LightWrapper>,
    );
    expect(screen.getByLabelText(/danger.*Critical/i)).toBeInTheDocument();
  });
});
