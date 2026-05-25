import { describe, expect, it } from "vitest";
import { render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  BlueprintThemeProvider,
  RailV2,
  usePalette,
  useBlueprintTheme,
} from "../index.js";
import { BLUEPRINT_DARK, BLUEPRINT_LIGHT } from "@tensorcost/tokens";

function rgb(hex: string): string {
  const h = hex.replace("#", "");
  return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
}

describe("BlueprintThemeProvider", () => {
  it("usePalette returns LIGHT by default (no provider)", () => {
    const { result } = renderHook(() => usePalette());
    expect(result.current).toBe(BLUEPRINT_LIGHT);
  });

  it("provider with mode=light resolves to BLUEPRINT_LIGHT", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BlueprintThemeProvider mode="light">{children}</BlueprintThemeProvider>
    );
    const { result } = renderHook(() => useBlueprintTheme(), { wrapper });
    expect(result.current.mode).toBe("light");
    expect(result.current.palette).toBe(BLUEPRINT_LIGHT);
  });

  it("provider with mode=dark resolves to BLUEPRINT_DARK", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BlueprintThemeProvider mode="dark">{children}</BlueprintThemeProvider>
    );
    const { result } = renderHook(() => useBlueprintTheme(), { wrapper });
    expect(result.current.mode).toBe("dark");
    expect(result.current.palette).toBe(BLUEPRINT_DARK);
  });

  it("explicit palette override wins over mode", () => {
    const custom = { ...BLUEPRINT_LIGHT, accent: "#000000" };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BlueprintThemeProvider mode="light" palette={custom}>
        {children}
      </BlueprintThemeProvider>
    );
    const { result } = renderHook(() => usePalette(), { wrapper });
    expect(result.current.accent).toBe("#000000");
  });
});

describe("RailV2 inside BlueprintThemeProvider", () => {
  it("renders with dark palette colors when mode=dark", () => {
    const { container } = render(
      <BlueprintThemeProvider mode="dark">
        <RailV2 active="router" tenant="Acme AI" />
      </BlueprintThemeProvider>,
    );
    const nav = container.querySelector("nav")!;
    // Outer rail background = dark paper (#0a0a0a → rgb(10, 10, 10))
    expect(nav.style.background).toBe(rgb(BLUEPRINT_DARK.paper));
  });

  it("renders with light palette colors by default", () => {
    const { container } = render(<RailV2 active="router" tenant="Acme AI" />);
    const nav = container.querySelector("nav")!;
    expect(nav.style.background).toBe(rgb(BLUEPRINT_LIGHT.paper));
  });
});
