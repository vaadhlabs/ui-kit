import { describe, expect, it } from "vitest";
import brandJson from "../brand.json";
import { BRAND_TOKENS_DARK, BRAND_TOKENS_LIGHT } from "../brand.js";
import type { BrandTokens } from "../brand.js";

// ---- structural equality --------------------------------------------------

describe("BRAND_TOKENS_LIGHT and BRAND_TOKENS_DARK share identical keys", () => {
  it("have the same set of keys", () => {
    const lightKeys = Object.keys(BRAND_TOKENS_LIGHT).sort();
    const darkKeys  = Object.keys(BRAND_TOKENS_DARK).sort();
    expect(darkKeys).toEqual(lightKeys);
  });
});

// ---- color validity -------------------------------------------------------

// Accepts #RGB, #RRGGBB, rgba(...) — only the fields that are meant to be colors.
const COLOR_KEYS: Array<keyof BrandTokens> = [
  "paper", "bgPage", "bgSoft",
  "ink", "ink2", "ink3", "ink4",
  "border", "borderStrong", "bgHover", "selected",
  "blue", "cyan", "positive", "warn", "danger", "purple",
];

function isValidColor(v: string): boolean {
  return /^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(v) ||
         /^rgba?\(/.test(v);
}

describe("BRAND_TOKENS_LIGHT color values", () => {
  it.each(COLOR_KEYS)("%s is a valid hex or rgba color", (key) => {
    expect(isValidColor(BRAND_TOKENS_LIGHT[key])).toBe(true);
  });
});

describe("BRAND_TOKENS_DARK color values", () => {
  it.each(COLOR_KEYS)("%s is a valid hex or rgba color", (key) => {
    expect(isValidColor(BRAND_TOKENS_DARK[key])).toBe(true);
  });
});

// ---- brand.json matches TS constants --------------------------------------

describe("brand.json snapshot", () => {
  it("light section matches BRAND_TOKENS_LIGHT", () => {
    expect(brandJson.light).toEqual(BRAND_TOKENS_LIGHT);
  });

  it("dark section matches BRAND_TOKENS_DARK", () => {
    expect(brandJson.dark).toEqual(BRAND_TOKENS_DARK);
  });
});
