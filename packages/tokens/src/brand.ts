/**
 * TensorCost brand design tokens — the canonical source of truth for the
 * color palette, radius scale, motion curves, and monospace font stack.
 *
 * These are raw values with no React or MUI dependency so any consumer
 * (marketing site, slides pipeline, Figma plugin, Python script) can
 * import them without pulling in the component tree.
 *
 * Radius and motion are inlined here rather than split into separate files
 * because both are <5 entries and are only consumed as part of the brand
 * object — splitting would add file-count with no practical benefit.
 */

export interface BrandTokens {
  paper: string;
  bgPage: string;
  bgSoft: string;
  ink: string;
  ink2: string;
  ink3: string;
  ink4: string;
  border: string;
  borderStrong: string;
  bgHover: string;
  selected: string;
  blue: string;
  cyan: string;
  positive: string;
  warn: string;
  danger: string;
  purple: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusPill: string;
  motionFast: string;
  motionDrawerOpen: string;
  motionDrawerClose: string;
  mono: string;
}

// Values exact per design_handoff_navigation_rail/README.md §Design tokens.
// ink2 bumped from #475569 → #334155 (7:1 on white) and ink3 from #94A3B8
// → #64748B (4.6:1) per contrast feedback 2026-05-19.
export const BRAND_TOKENS_LIGHT: BrandTokens = {
  paper: "#FFFFFF",
  bgPage: "#FAFBFC",
  bgSoft: "#F8FAFC",
  ink: "#0F172A",
  ink2: "#334155",
  ink3: "#64748B",
  ink4: "#CBD5E1",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  bgHover: "#F1F5F9",
  selected: "rgba(59,130,246,0.08)",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  positive: "#10B981",
  warn: "#F59E0B",
  danger: "#EF4444",
  purple: "#A855F7",
  radiusSm: "6px",
  radiusMd: "8px",
  radiusLg: "10px",
  radiusXl: "12px",
  radiusPill: "999px",
  motionFast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  motionDrawerOpen: "240ms cubic-bezier(0.4, 0, 0.2, 1)",
  motionDrawerClose: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  mono: "'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace",
};

export const BRAND_TOKENS_DARK: BrandTokens = {
  paper: "#1E293B",
  bgPage: "#0F172A",
  bgSoft: "#172033",
  ink: "#F8FAFC",
  ink2: "#CBD5E1",
  ink3: "#94A3B8",
  ink4: "#475569",
  border: "rgba(148,163,184,0.16)",
  borderStrong: "rgba(148,163,184,0.28)",
  bgHover: "rgba(255,255,255,0.05)",
  selected: "rgba(59,130,246,0.18)",
  blue: "#60A5FA",
  cyan: "#22D3EE",
  positive: "#34D399",
  warn: "#FBBF24",
  danger: "#F87171",
  purple: "#C084FC",
  radiusSm: "6px",
  radiusMd: "8px",
  radiusLg: "10px",
  radiusXl: "12px",
  radiusPill: "999px",
  motionFast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  motionDrawerOpen: "240ms cubic-bezier(0.4, 0, 0.2, 1)",
  motionDrawerClose: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  mono: "'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace",
};
