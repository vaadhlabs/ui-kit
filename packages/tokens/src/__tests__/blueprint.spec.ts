import { describe, expect, it } from "vitest";
import {
  BLUEPRINT_DARK,
  BLUEPRINT_FAMILIES,
  BLUEPRINT_LIGHT,
  BLUEPRINT_SPACING,
  BLUEPRINT_TOKENS_DARK,
  BLUEPRINT_TOKENS_LIGHT,
  BLUEPRINT_TYPE,
  strokeFor,
} from "../blueprint.js";
import type { BlueprintPalette } from "../blueprint.js";

const isHex = (v: string): boolean =>
  /^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(v) || /^rgba?\(/.test(v);

const PALETTE_KEYS: Array<keyof BlueprintPalette> = [
  "paper", "paper2", "paper3", "faint",
  "ink", "ink2", "ink3", "ink4",
  "accent", "accentBg",
  "good", "warn", "danger",
];

describe("blueprint palette", () => {
  it("light and dark share the same key set", () => {
    expect(Object.keys(BLUEPRINT_LIGHT).sort()).toEqual(Object.keys(BLUEPRINT_DARK).sort());
  });

  it.each(PALETTE_KEYS)("light.%s is a valid color value", (k) => {
    expect(isHex(BLUEPRINT_LIGHT[k])).toBe(true);
  });

  it.each(PALETTE_KEYS)("dark.%s is a valid color value", (k) => {
    expect(isHex(BLUEPRINT_DARK[k])).toBe(true);
  });

  it("pins the signal-accent hex from the design", () => {
    // The wireframes use #FF4814 as the single accent and the strategy
    // doc treats it as identity — locking the value so a future
    // accidental rebrand needs an intentional change here.
    expect(BLUEPRINT_LIGHT.accent).toBe("#FF4814");
    expect(BLUEPRINT_DARK.accent).toBe("#FF4814");
  });

  it("uses warm vellum as the light paper, near-black ink", () => {
    // Paper warmed 2026-05-25 (see blueprint.ts) — vellum tint, not near-white.
    expect(BLUEPRINT_LIGHT.paper).toBe("#f4eedc");
    expect(BLUEPRINT_LIGHT.ink).toBe("#0a0a0a");
  });
});

describe("blueprint typography", () => {
  it("display family is Inter Tight", () => {
    expect(BLUEPRINT_FAMILIES.display.toLowerCase()).toContain("inter tight");
  });
  it("mono family is IBM Plex Mono", () => {
    expect(BLUEPRINT_FAMILIES.mono.toLowerCase()).toContain("ibm plex mono");
  });
  it("eyebrow is mono, 10px, uppercase, tight tracking", () => {
    expect(BLUEPRINT_TYPE.eyebrow.fontSize).toBe("0.625rem");
    expect(BLUEPRINT_TYPE.eyebrow.textTransform).toBe("uppercase");
    expect(BLUEPRINT_TYPE.eyebrow.letterSpacing).toBe("0.16em");
    expect(BLUEPRINT_TYPE.eyebrow.fontFamily.toLowerCase()).toContain("plex mono");
  });
  it("h1 / h2 / h3 use medium display weight with negative tracking", () => {
    for (const h of [BLUEPRINT_TYPE.h1, BLUEPRINT_TYPE.h2, BLUEPRINT_TYPE.h3] as const) {
      expect(h.fontWeight).toBe(500);
      expect(h.letterSpacing.startsWith("-")).toBe(true);
    }
  });
});

describe("blueprint spacing", () => {
  it("indexed scale is an 8px grid", () => {
    expect(BLUEPRINT_SPACING.n).toEqual([
      "0", "4px", "8px", "12px", "16px", "20px", "24px", "28px", "32px", "40px", "48px", "56px",
    ]);
  });
  it("named scale matches the indexed scale at key stops", () => {
    expect(BLUEPRINT_SPACING.xs).toBe(BLUEPRINT_SPACING.n[2]);
    expect(BLUEPRINT_SPACING.md).toBe(BLUEPRINT_SPACING.n[4]);
    expect(BLUEPRINT_SPACING.xxl).toBe(BLUEPRINT_SPACING.n[7]);
  });
});

describe("blueprint stroke", () => {
  it("derives hairline against the given palette", () => {
    const s = strokeFor(BLUEPRINT_LIGHT);
    expect(s.hairline).toBe("1px solid #0a0a0a");
    expect(s.hairlineSoft).toBe(`1px solid ${BLUEPRINT_LIGHT.paper3}`);
    expect(s.ghost).toBe(`1px dashed ${BLUEPRINT_LIGHT.faint}`);
  });
});

describe("BLUEPRINT_TOKENS bundle", () => {
  it("exposes palette/families/type/spacing/stroke on light + dark", () => {
    for (const t of [BLUEPRINT_TOKENS_LIGHT, BLUEPRINT_TOKENS_DARK] as const) {
      expect(t.palette).toBeDefined();
      expect(t.families).toBe(BLUEPRINT_FAMILIES);
      expect(t.type).toBe(BLUEPRINT_TYPE);
      expect(t.spacing).toBe(BLUEPRINT_SPACING);
      expect(t.stroke.hairline.startsWith("1px solid")).toBe(true);
    }
  });
});
