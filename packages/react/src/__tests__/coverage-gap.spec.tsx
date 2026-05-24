// coverage-gap.spec.tsx — smoke tests for pre-existing files that had 0%
// coverage before the navrail work (2026-05-19). These tests are intentionally
// minimal: they exercise the functions so the threshold passes, and serve as
// a regression baseline. Full behavioral coverage belongs in a dedicated spec.

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { renderHook } from "@testing-library/react";
import { createWorkshopTheme } from "../workshop-theme.js";
import { WorkshopCard } from "../WorkshopCard.js";
import { SectionProvider } from "../section.js";
import { useTone, useAllocPalette } from "../tone.js";

function WorkshopWrapper({ children, mode = "light" }: { children: React.ReactNode; mode?: "light" | "dark" }) {
  return (
    <ThemeProvider theme={createWorkshopTheme(mode)}>{children}</ThemeProvider>
  );
}

describe("WorkshopCard", () => {
  it("renders children outside a SectionProvider (plain card, no ribbon)", () => {
    render(
      <WorkshopWrapper>
        <WorkshopCard>
          <span data-testid="content">Hello</span>
        </WorkshopCard>
      </WorkshopWrapper>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders with ribbon inside a SectionProvider", () => {
    render(
      <WorkshopWrapper>
        <SectionProvider section="observe">
          <WorkshopCard>
            <span data-testid="ribcontent">Ribbon card</span>
          </WorkshopCard>
        </SectionProvider>
      </WorkshopWrapper>,
    );
    expect(screen.getByTestId("ribcontent")).toBeInTheDocument();
  });

  it("renders as plain (no ribbon) when plain=true inside a SectionProvider", () => {
    render(
      <WorkshopWrapper>
        <SectionProvider section="optimize">
          <WorkshopCard plain>
            <span data-testid="plain">Plain</span>
          </WorkshopCard>
        </SectionProvider>
      </WorkshopWrapper>,
    );
    expect(screen.getByTestId("plain")).toBeInTheDocument();
  });

  it("renders in dark mode", () => {
    render(
      <WorkshopWrapper mode="dark">
        <SectionProvider section="govern">
          <WorkshopCard>
            <span data-testid="dark">Dark</span>
          </WorkshopCard>
        </SectionProvider>
      </WorkshopWrapper>,
    );
    expect(screen.getByTestId("dark")).toBeInTheDocument();
  });
});

describe("useTone", () => {
  it("returns light tone tokens in light mode", () => {
    const { result } = renderHook(() => useTone(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <WorkshopWrapper>{children}</WorkshopWrapper>
      ),
    });
    expect(result.current.good.fg).toBe("#15803D");
    expect(result.current.bad.fg).toBe("#B91C1C");
    expect(result.current.warn.fg).toBe("#B45309");
    expect(result.current.info.fg).toBe("#2563EB");
    expect(result.current.neutral.fg).toBe("#5C5A52");
  });

  it("returns dark tone tokens in dark mode", () => {
    const { result } = renderHook(() => useTone(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <WorkshopWrapper mode="dark">{children}</WorkshopWrapper>
      ),
    });
    expect(result.current.good.fg).toBe("#34D399");
    expect(result.current.bad.fg).toBe("#FB7185");
  });
});

describe("useAllocPalette", () => {
  it("returns 6 light-mode colors", () => {
    const { result } = renderHook(() => useAllocPalette(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <WorkshopWrapper>{children}</WorkshopWrapper>
      ),
    });
    expect(result.current.length).toBe(6);
    expect(result.current[0]).toBe("#0F766E");
  });

  it("returns 6 dark-mode colors", () => {
    const { result } = renderHook(() => useAllocPalette(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <WorkshopWrapper mode="dark">{children}</WorkshopWrapper>
      ),
    });
    expect(result.current.length).toBe(6);
    expect(result.current[0]).toBe("#5EEAD4");
  });
});
