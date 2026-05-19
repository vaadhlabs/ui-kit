import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createTensorTheme } from "./theme.js";
import { MobileTopBar } from "./MobileTopBar.js";

function Wrapper({ children, mode = "light" }: { children: React.ReactNode; mode?: "light" | "dark" }) {
  return (
    <ThemeProvider theme={createTensorTheme(mode)}>{children}</ThemeProvider>
  );
}

describe("MobileTopBar", () => {
  it("renders the page title", () => {
    render(
      <Wrapper>
        <MobileTopBar title="Cost ops" alertsCount={0} onMenu={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Cost ops" })).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <Wrapper>
        <MobileTopBar title="Cost ops" subtitle="$55k · 30d" alertsCount={0} onMenu={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByText("$55k · 30d")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    render(
      <Wrapper>
        <MobileTopBar title="Alerts" alertsCount={3} onMenu={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.queryByText("$55k · 30d")).not.toBeInTheDocument();
  });

  it("calls onMenu when hamburger is clicked", () => {
    const onMenu = vi.fn();
    render(
      <Wrapper>
        <MobileTopBar title="Cost ops" alertsCount={0} onMenu={onMenu} />
      </Wrapper>,
    );
    const hamburger = screen.getByRole("button", { name: /open navigation/i });
    fireEvent.click(hamburger);
    expect(onMenu).toHaveBeenCalledOnce();
  });

  it("renders alert badge when alertsCount > 0", () => {
    render(
      <Wrapper>
        <MobileTopBar title="Alerts" alertsCount={5} onMenu={vi.fn()} />
      </Wrapper>,
    );
    // Badge should show the count
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("does not render badge when alertsCount is 0", () => {
    render(
      <Wrapper>
        <MobileTopBar title="Alerts" alertsCount={0} onMenu={vi.fn()} />
      </Wrapper>,
    );
    // No badge number
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("bell button has accessible label with count when alertsCount > 0", () => {
    render(
      <Wrapper>
        <MobileTopBar title="x" alertsCount={3} onMenu={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByRole("button", { name: "3 alerts" })).toBeInTheDocument();
  });

  it("calls onAlerts when bell is clicked", () => {
    const onAlerts = vi.fn();
    render(
      <Wrapper>
        <MobileTopBar title="x" alertsCount={2} onMenu={vi.fn()} onAlerts={onAlerts} />
      </Wrapper>,
    );
    const bell = screen.getByRole("button", { name: /alerts/i });
    fireEvent.click(bell);
    expect(onAlerts).toHaveBeenCalledOnce();
  });

  it("renders TensorCost brand", () => {
    render(
      <Wrapper>
        <MobileTopBar title="x" alertsCount={0} onMenu={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
  });

  it("renders in dark mode without errors", () => {
    render(
      <Wrapper mode="dark">
        <MobileTopBar title="GPU fleet" alertsCount={1} onMenu={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// logoSlot — user feedback 2026-05-19
// ---------------------------------------------------------------------------

describe("MobileTopBar — logoSlot prop", () => {
  it("renders logoSlot node when provided", () => {
    render(
      <Wrapper>
        <MobileTopBar
          title="Cost ops"
          alertsCount={0}
          onMenu={vi.fn()}
          logoSlot={<span>REAL-LOGO</span>}
        />
      </Wrapper>,
    );
    expect(screen.getByText("REAL-LOGO")).toBeInTheDocument();
    expect(screen.queryByText("TensorCost")).not.toBeInTheDocument();
  });

  it("falls back to gradient + TensorCost text when logoSlot is omitted", () => {
    render(
      <Wrapper>
        <MobileTopBar title="Cost ops" alertsCount={0} onMenu={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
  });
});
