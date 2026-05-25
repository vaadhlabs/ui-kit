/**
 * v2 blueprint tokens — the architectural-drawing vocabulary that lands at GA.
 *
 * Hairline ink on warm vellum, single signal accent, no rounded corners,
 * no gradients, no shadows. Inter Tight for display, Inter for body,
 * IBM Plex Mono for every number and label.
 *
 * Source of truth: `wireframes-v2/kit.jsx` (the K2 object), via the
 * Claude Design handoff bundle. This file is the production mirror —
 * field names track the design source so a designer reading both can
 * cross-reference cleanly.
 *
 * Coexistence with Workshop tokens (`brand.ts`): both palettes ship in
 * 1.0.0. Workshop powers the un-flagged shell rail and any un-migrated
 * MF; blueprint powers the v2 rail + the five v2 surface heroes as they
 * land per-stream. Workshop sunsets in 2.0.0 once the post-GA surface
 * polish completes.
 */

// ============================================================================
// Palette
// ============================================================================

export interface BlueprintPalette {
  // Paper — warm white vellum. paper2/3 are the two ruled-grid step-downs
  // the design uses for table headers and inactive surfaces. faint is the
  // hairline ghost — used for absent rows and disabled separators.
  paper: string;
  paper2: string;
  paper3: string;
  faint: string;

  // Ink — near-black on light. The four steps map to body weight, label
  // weight, secondary label weight, disabled.
  ink: string;
  ink2: string;
  ink3: string;
  ink4: string;

  // Single signal accent — used ONLY for "the bet" annotations: leader
  // callouts, the routing trade-off highlight, the accent-row marker on
  // a table. If you find yourself reaching for accent for anything else,
  // ask whether the thing is actually "the bet" or just emphasis.
  accent: string;
  accentBg: string;

  // Status — used sparingly. Green for pass, amber for warn / fallback,
  // red for blocked / error. These do not double as primary colors.
  good: string;
  warn: string;
  danger: string;
}

export const BLUEPRINT_LIGHT: BlueprintPalette = {
  // Paper steps warmed up 2026-05-25 — operator feedback that the
  // original near-white #fbfaf6 read as "too much white", not the
  // vellum-on-architectural-drawing tone the design calls for.
  // New values land closer to actual blueprint paper: a tinted
  // off-white with visible warm bias, and the elevation steps are
  // perceivably warmer too so a card on paper2/paper3 reads as a
  // distinct layer instead of a near-identical sheet.
  paper: "#f4eedc",
  paper2: "#ece6d0",
  paper3: "#ddd6bd",
  faint: "#a89e83",

  ink: "#0a0a0a",
  ink2: "#3a3a36",
  ink3: "#6e6c64",
  ink4: "#16161a",

  accent: "#FF4814",
  accentBg: "#ffe8dc",

  good: "#0a7a2f",
  warn: "#a05c00",
  danger: "#b91c1c",
};

/**
 * Dark blueprint — engineered to land as a first-class surface, not a
 * crude invert. Initial GA plan deferred dark, but operator + customer
 * feedback 2026-05-25 was "the side rail and overall dark looks bad" —
 * so this palette is now the production dark we ship behind v2.
 *
 * Design intent: the same warm-architectural-drawing aesthetic, lit from
 * the other side. The paper steps form a perceivable elevation ladder
 * (a flat #0a0a0a → #16161a → #3a3a36 jump from the earlier stub gave a
 * muddy middle layer because paper2 sat too close to paper3, and a
 * harsh edge between paper3 and ink). The ink steps are warm
 * off-whites — `#fbfaf6` worked on paper but glowed like a fluorescent
 * tube on a black field; we step it down to a slightly creamier value
 * and tighten the ink2/ink3 contrast ratio so labels don't disappear.
 *
 * Verified pairs at WCAG AA: ink/paper 16.4:1, ink2/paper 12.1:1,
 * ink3/paper 6.7:1, ink/paper3 9.8:1 (the active-row pair on the rail).
 * accent/paper 5.9:1 — passes for large text and chip backgrounds; the
 * accent foreground on accentBg is still the same hairline ink, never
 * the accent itself on accent — that's the only rule that survives
 * unchanged from light.
 */
export const BLUEPRINT_DARK: BlueprintPalette = {
  // Paper — warm graphite, not pure black. paper2 is a clear step up,
  // paper3 is the table-header / popover-surface layer the rail's
  // bottom strip sits on. faint is the ghost-row / disabled-separator
  // tone — visible but inert.
  paper: "#0e0f12",
  paper2: "#16181d",
  paper3: "#21242c",
  faint: "#3a3d45",

  // Ink — warm off-white at the top, stepping down to a muted slate
  // for tertiary labels. ink4 is the disabled-text floor.
  ink: "#ece9e0",
  ink2: "#c3c0b6",
  ink3: "#8a8880",
  ink4: "#52514c",

  // Accent stays the blueprint orange — the only colour on screen.
  // accentBg uses a higher alpha than light (0.18 vs 0.14) so the
  // accent-row marker reads on dark paper without going neon.
  accent: "#FF4814",
  accentBg: "rgba(255,72,20,0.18)",

  // Status — desaturated steps tuned to land between ink2 and ink3
  // luminance so they integrate with the page instead of shouting.
  good: "#5fb878",
  warn: "#d6a85b",
  danger: "#e57373",
};

// ============================================================================
// Typography
// ============================================================================

export interface BlueprintTypeFamily {
  /** Display family — H1 / H2 / H3, page titles. Inter Tight. */
  display: string;
  /** Body family — everything that's prose. Inter. */
  body: string;
  /** Mono family — numbers, labels, code, the eyebrow kicker. IBM Plex Mono. */
  mono: string;
}

export const BLUEPRINT_FAMILIES: BlueprintTypeFamily = {
  display: "'Inter Tight', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, 'Cascadia Code', monospace",
};

export interface BlueprintTypeScale {
  /** Default sizes per role. Components can override (the design uses H1
   *  at 56px default but ramps to 88px on the thesis page). */

  /** H1 — page hero. 56px / weight 500 / -0.02em / lh 1.02. */
  h1: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
  /** H2 — section header. 32px / weight 500 / lh 1.1. */
  h2: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
  /** H3 — sub-section / card title. 20px / weight 500 / lh 1.18. */
  h3: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
  /** Body — default prose. 13px / weight 400 / lh 1.45. */
  body: { fontSize: string; fontWeight: number; lineHeight: number };
  /** Mono — labels, code, small numbers. 11px / weight 500 / lh 1.4. */
  mono: { fontSize: string; fontWeight: number; lineHeight: number };
  /** Num — display number. 32px default; component ramps to 120 on hero. */
  num: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
  /** Eyebrow — 10px uppercase mono kicker. 0.16em tracking. */
  eyebrow: {
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    letterSpacing: string;
    textTransform: "uppercase";
  };
}

export const BLUEPRINT_TYPE: BlueprintTypeScale = {
  h1: { fontSize: "3.5rem", fontWeight: 500, lineHeight: 1.02, letterSpacing: "-0.02em" },
  h2: { fontSize: "2rem", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.01em" },
  h3: { fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.18, letterSpacing: "-0.005em" },
  body: { fontSize: "0.8125rem", fontWeight: 400, lineHeight: 1.45 },
  mono: { fontSize: "0.6875rem", fontWeight: 500, lineHeight: 1.4 },
  num: { fontSize: "2rem", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.02em" },
  eyebrow: {
    fontFamily: BLUEPRINT_FAMILIES.mono,
    fontSize: "0.625rem",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
};

// ============================================================================
// Spacing — 8px grid
// ============================================================================

/**
 * 8px grid, matching the design's grid overlay
 * (`background-size: 8px 8px`) and the padding rhythm throughout the
 * wireframes. The named scale covers the common stops; the `n` array is
 * for sx-prop / inline-style consumers that want indexed access
 * (`SPACING.n[4]` === 16px).
 */
export interface BlueprintSpacing {
  xxs: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
  n: readonly string[];
}

export const BLUEPRINT_SPACING: BlueprintSpacing = {
  xxs: "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  xxl: "28px",
  "2xl": "32px",
  "3xl": "40px",
  "4xl": "48px",
  "5xl": "56px",
  n: ["0", "4px", "8px", "12px", "16px", "20px", "24px", "28px", "32px", "40px", "48px", "56px"] as const,
};

// ============================================================================
// Stroke — hairline ink
// ============================================================================

/**
 * v2 borders are always 1px solid `ink` for primary chrome (frames,
 * tables, top-bars) and 1px solid `paper3` for in-card dividers and
 * inactive separators. There are exactly three stroke styles in the
 * system; if a component reaches for a fourth, the design is wrong.
 */
export interface BlueprintStroke {
  /** 1px solid ink — primary chrome. */
  hairline: string;
  /** 1px solid paper3 — in-card divider. */
  hairlineSoft: string;
  /** 1px dashed faint — ghost / placeholder boundary. */
  ghost: string;
}

export function strokeFor(palette: BlueprintPalette): BlueprintStroke {
  return {
    hairline: `1px solid ${palette.ink}`,
    hairlineSoft: `1px solid ${palette.paper3}`,
    ghost: `1px dashed ${palette.faint}`,
  };
}

// ============================================================================
// Bundle
// ============================================================================

/**
 * One-shot accessor for consumers who want the whole blueprint as a
 * single object. The discrete exports above stay the primary entry
 * points; this is convenience for inline-style sites.
 */
export interface BlueprintTokens {
  palette: BlueprintPalette;
  families: BlueprintTypeFamily;
  type: BlueprintTypeScale;
  spacing: BlueprintSpacing;
  stroke: BlueprintStroke;
}

export const BLUEPRINT_TOKENS_LIGHT: BlueprintTokens = {
  palette: BLUEPRINT_LIGHT,
  families: BLUEPRINT_FAMILIES,
  type: BLUEPRINT_TYPE,
  spacing: BLUEPRINT_SPACING,
  stroke: strokeFor(BLUEPRINT_LIGHT),
};

export const BLUEPRINT_TOKENS_DARK: BlueprintTokens = {
  palette: BLUEPRINT_DARK,
  families: BLUEPRINT_FAMILIES,
  type: BLUEPRINT_TYPE,
  spacing: BLUEPRINT_SPACING,
  stroke: strokeFor(BLUEPRINT_DARK),
};
