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
  // NOTE — title + subtitle are accepted on the API for back-compat with
  // callers (shell still passes them) but are NOT rendered. WorkflowPage
  // owns the page header; rendering them here too produced two stacked
  // headers on mobile. See the comment in MobileTopBar.tsx where the
  // title strip used to live. Tests below assert the NEW contract.
  it("does NOT render a page-title h1 (WorkflowPage owns the title now)", () => {
    render(
      <Wrapper>
        <MobileTopBar title="Cost ops" alertsCount={0} onMenu={vi.fn()} />
      </Wrapper>,
    );
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByText("Cost ops")).not.toBeInTheDocument();
  });

  it("does not render subtitle text — props kept for API back-compat only", () => {
    render(
      <Wrapper>
        <MobileTopBar title="Cost ops" subtitle="$55k · 30d" alertsCount={0} onMenu={vi.fn()} />
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
    // No h1 — WorkflowPage owns the title. Smoke-test the hamburger is still here.
    expect(screen.getByRole("button", { name: /open navigation/i })).toBeInTheDocument();
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
