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
