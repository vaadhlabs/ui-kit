/**
 * Semantic tone tokens for chips, alert callouts, savings figures, and
 * status pills. Each tone maps to bg/fg/border for light and dark mode
 * so consumers don't hand-pick hex per chip.
 *
 * The React hook (useTone) lives in @tensorcost/ui-kit since it depends
 * on @mui/material/styles. This file exports the raw records and types
 * so non-React consumers can read them directly.
 */

export type ToneKind = "good" | "bad" | "warn" | "info" | "neutral";

export interface ToneTokens {
  /** Pill / chip / callout background (low-alpha tint). */
  bg: string;
  /** Foreground text on top of `bg`. */
  fg: string;
  /** Left-border accent for callout boxes. Same hue as `fg`. */
  border: string;
}

export const TONE_LIGHT: Record<ToneKind, ToneTokens> = {
  good:    { bg: "#DCFCE7", fg: "#15803D", border: "#15803D" },
  bad:     { bg: "#FEE2E2", fg: "#B91C1C", border: "#BE123C" },
  warn:    { bg: "#FFFBEB", fg: "#B45309", border: "#B45309" },
  info:    { bg: "#EFF6FF", fg: "#2563EB", border: "#2563EB" },
  neutral: { bg: "#F1F5F9", fg: "#5C5A52", border: "#5C5A52" },
};

export const TONE_DARK: Record<ToneKind, ToneTokens> = {
  // Dark-mode tones: same hue family, swapped to translucent overlays
  // (~14% alpha) so chips sit ABOVE the #161B22 paper without losing
  // contrast. Foreground bumps a luminance step (#34D399 vs #15803D)
  // to clear the 4.5:1 AA bar against the darker bg overlay.
  good:    { bg: "rgba(52,211,153,0.14)",  fg: "#34D399", border: "#34D399" },
  bad:     { bg: "rgba(251,113,133,0.14)", fg: "#FB7185", border: "#FB7185" },
  warn:    { bg: "rgba(251,191,36,0.14)",  fg: "#FBBF24", border: "#FBBF24" },
  info:    { bg: "rgba(96,165,250,0.14)",  fg: "#60A5FA", border: "#60A5FA" },
  neutral: { bg: "rgba(155,168,184,0.14)", fg: "#9BA8B8", border: "#9BA8B8" },
};
