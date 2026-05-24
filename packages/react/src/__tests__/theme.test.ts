import { describe, expect, it } from "vitest";
import { createTensorTheme } from "../theme.js";

describe("createTensorTheme", () => {
  it("creates a light theme with default colors", () => {
    const t = createTensorTheme("light");
    expect(t.palette.mode).toBe("light");
    expect(t.palette.primary.main).toBe("#3B82F6");
    expect(t.palette.background.default).toBe("#F1F5F9");
  });

  it("creates a dark theme with dark backgrounds", () => {
    const t = createTensorTheme("dark");
    expect(t.palette.mode).toBe("dark");
    expect(t.palette.background.default).toBe("#0F172A");
  });

  it("respects color overrides", () => {
    const t = createTensorTheme("light", { primary: "#ABCDEF", secondary: "#FEDCBA" });
    expect(t.palette.primary.main).toBe("#ABCDEF");
    expect(t.palette.secondary.main).toBe("#FEDCBA");
  });

  it("sets typography fontFamily and shape", () => {
    const t = createTensorTheme("light");
    expect(t.typography.fontFamily).toMatch(/Inter/);
    expect(t.shape.borderRadius).toBe(8);
  });
});

// Navrail brand token tests — added 2026-05-19
describe("createTensorTheme — brand tokens", () => {
  it("exposes light brand tokens on palette.brand", () => {
    const t = createTensorTheme("light");
    expect(t.palette.brand.blue).toBe("#3B82F6");
    expect(t.palette.brand.cyan).toBe("#06B6D4");
    expect(t.palette.brand.paper).toBe("#FFFFFF");
    expect(t.palette.brand.bgPage).toBe("#FAFBFC");
    expect(t.palette.brand.ink).toBe("#0F172A");
    expect(t.palette.brand.positive).toBe("#10B981");
    expect(t.palette.brand.danger).toBe("#EF4444");
    expect(t.palette.brand.warn).toBe("#F59E0B");
  });

  it("exposes dark brand tokens on palette.brand with lifted hues", () => {
    const t = createTensorTheme("dark");
    expect(t.palette.brand.blue).toBe("#60A5FA");
    expect(t.palette.brand.cyan).toBe("#22D3EE");
    expect(t.palette.brand.paper).toBe("#1E293B");
    expect(t.palette.brand.bgPage).toBe("#0F172A");
    expect(t.palette.brand.ink).toBe("#F8FAFC");
    expect(t.palette.brand.positive).toBe("#34D399");
    expect(t.palette.brand.danger).toBe("#F87171");
    expect(t.palette.brand.warn).toBe("#FBBF24");
  });

  it("exposes radius tokens", () => {
    const t = createTensorTheme("light");
    expect(t.palette.brand.radiusSm).toBe("6px");
    expect(t.palette.brand.radiusMd).toBe("8px");
    expect(t.palette.brand.radiusXl).toBe("12px");
    expect(t.palette.brand.radiusPill).toBe("999px");
  });

  it("exposes motion tokens", () => {
    const t = createTensorTheme("light");
    expect(t.palette.brand.motionFast).toMatch(/150ms/);
    expect(t.palette.brand.motionDrawerOpen).toMatch(/240ms/);
    expect(t.palette.brand.motionDrawerClose).toMatch(/200ms/);
  });

  it("mono token references JetBrains Mono", () => {
    const t = createTensorTheme("light");
    expect(t.palette.brand.mono).toMatch(/JetBrains Mono/);
  });

  it("dark border uses rgba (not solid hex)", () => {
    const t = createTensorTheme("dark");
    expect(t.palette.brand.border).toMatch(/rgba/);
  });

  it("light selected is lower alpha than dark selected", () => {
    const tL = createTensorTheme("light");
    const tD = createTensorTheme("dark");
    // Light: 0.08 alpha; dark: 0.18 alpha — pick out the numbers
    const alphaLight = parseFloat(tL.palette.brand.selected.replace(/.*,\s*/, "").replace(/\).*/, ""));
    const alphaDark  = parseFloat(tD.palette.brand.selected.replace(/.*,\s*/, "").replace(/\).*/, ""));
    expect(alphaDark).toBeGreaterThan(alphaLight);
  });
});
