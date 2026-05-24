import { describe, expect, it } from "vitest";
import { TONE_DARK, TONE_LIGHT } from "../tone.js";
import type { ToneKind } from "../tone.js";

const TONE_KINDS: ToneKind[] = ["good", "bad", "warn", "info", "neutral"];

function isValidColor(v: string): boolean {
  return /^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(v) ||
         /^rgba?\(/.test(v);
}

describe("TONE_LIGHT", () => {
  it("covers all 5 ToneKind values", () => {
    expect(Object.keys(TONE_LIGHT).sort()).toEqual([...TONE_KINDS].sort());
  });

  it.each(TONE_KINDS)("%s has valid bg, fg, border colors", (kind) => {
    const t = TONE_LIGHT[kind];
    expect(isValidColor(t.bg)).toBe(true);
    expect(isValidColor(t.fg)).toBe(true);
    expect(isValidColor(t.border)).toBe(true);
  });
});

describe("TONE_DARK", () => {
  it("covers all 5 ToneKind values", () => {
    expect(Object.keys(TONE_DARK).sort()).toEqual([...TONE_KINDS].sort());
  });

  it.each(TONE_KINDS)("%s has valid bg, fg, border colors", (kind) => {
    const t = TONE_DARK[kind];
    expect(isValidColor(t.bg)).toBe(true);
    expect(isValidColor(t.fg)).toBe(true);
    expect(isValidColor(t.border)).toBe(true);
  });

  it("dark good.bg uses rgba (translucent overlay)", () => {
    expect(TONE_DARK.good.bg).toMatch(/^rgba\(/);
  });
});

describe("TONE_LIGHT and TONE_DARK structural parity", () => {
  it("have the same set of keys", () => {
    expect(Object.keys(TONE_DARK).sort()).toEqual(Object.keys(TONE_LIGHT).sort());
  });
});
