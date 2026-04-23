import { describe, expect, it } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CHART_COLORS,
  CHART_PALETTE,
  ChartTooltip,
  formatMoney,
  useAxisStyle,
  useGridStyle,
} from "../charts.js";

describe("chart constants", () => {
  it("exposes a colour map and palette", () => {
    expect(CHART_COLORS.primary).toBeTruthy();
    expect(CHART_PALETTE.length).toBeGreaterThan(0);
  });
});

describe("formatMoney", () => {
  it("formats finite numbers", () => {
    expect(formatMoney(1500)).toMatch(/\$1,500/);
    expect(formatMoney("250")).toMatch(/\$250/);
  });
  it("returns dash for nullish or non-finite", () => {
    expect(formatMoney(undefined)).toBe("—");
    expect(formatMoney("not-a-number")).toBe("—");
    expect(formatMoney(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

function withTheme(mode: "light" | "dark") {
  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={createTheme({ palette: { mode } })}>{children}</ThemeProvider>
  );
}

describe("useAxisStyle / useGridStyle", () => {
  it("returns light variant by default", () => {
    const { result } = renderHook(() => useAxisStyle(), { wrapper: withTheme("light") });
    expect(result.current.tickLine).toBe(false);
  });
  it("returns dark variant in dark mode", () => {
    const { result } = renderHook(() => useGridStyle(), { wrapper: withTheme("dark") });
    expect(result.current.strokeDasharray).toBe("3 3");
  });
});

describe("ChartTooltip", () => {
  it("renders nothing when inactive or empty payload", () => {
    const { container } = render(<ChartTooltip active={false} payload={[]} label="x" />);
    expect(container.innerHTML).toBe("");
  });
  it("renders payload entries with a formatter", () => {
    render(
      <ChartTooltip
        active
        label="2026"
        formatter={(v) => `formatted-${v}`}
        payload={[{ name: "cost", value: 99, color: "#000" }]}
      />,
    );
    expect(screen.getByText(/cost: formatted-99/)).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
  });
  it("renders raw value when no formatter", () => {
    render(
      <ChartTooltip
        active
        label="L"
        payload={[{ name: "v", value: "abc", color: "#fff" }]}
      />,
    );
    expect(screen.getByText(/v: abc/)).toBeInTheDocument();
  });
});
