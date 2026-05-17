import { useTheme } from "@mui/material/styles";

/**
 * Semantic tone tokens for chips, alert callouts, savings figures, and
 * status pills across Workshop pages. Each tone maps to a bg/fg pair
 * for light and dark mode so consumers don't hand-pick hex per chip.
 *
 * Why a hook and not raw hex constants: Workshop pages render under
 * both the light and dark createWorkshopTheme variants depending on
 * the shell's <ThemeShellProvider> setting. Hand-coding `#DCFCE7` for
 * a "good" chip works in light but is unreadably bright on dark.
 * `useTone("good")` returns the right pair for whichever mode the tree
 * is currently in.
 *
 * Usage:
 *   const tone = useTone();
 *   <Chip sx={{ bgcolor: tone.good.bg, color: tone.good.fg }} />
 *   <Box sx={{ borderLeft: `3px solid ${tone.warn.border}` }} />
 *
 * Why not put this on theme.palette.workshop.tone directly: that would
 * force every consumer to either useTheme() or thread the theme down
 * by hand. A small hook keeps the call site to one line.
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

const LIGHT: Record<ToneKind, ToneTokens> = {
  good:    { bg: "#DCFCE7", fg: "#15803D", border: "#15803D" },
  bad:     { bg: "#FEE2E2", fg: "#B91C1C", border: "#BE123C" },
  warn:    { bg: "#FFFBEB", fg: "#B45309", border: "#B45309" },
  info:    { bg: "#EFF6FF", fg: "#2563EB", border: "#2563EB" },
  neutral: { bg: "#F1F5F9", fg: "#5C5A52", border: "#5C5A52" },
};

const DARK: Record<ToneKind, ToneTokens> = {
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

export function useTone(): Record<ToneKind, ToneTokens> {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? DARK : LIGHT;
}

/**
 * Allocation palette for donut + stacked area charts. Different from
 * tone tokens: these are category-distinguishing colors, not semantic
 * status colors. Workshop pages render up to 6 categories at once
 * (cost-center, savings-ledger), so the palette holds 6 distinct hues.
 */
const ALLOC_LIGHT: readonly string[] = [
  "#0F766E", // optimize teal
  "#2563EB", // observe blue
  "#7C3AED", // operations purple
  "#B45309", // govern amber
  "#0EA5E9", // sky
  "#EC4899", // pink
];

const ALLOC_DARK: readonly string[] = [
  "#5EEAD4", // optimize teal (dark variant)
  "#60A5FA", // observe blue (dark variant)
  "#A78BFA", // operations purple (dark variant)
  "#FBBF24", // govern amber (dark variant)
  "#38BDF8", // sky (dark variant)
  "#F472B6", // pink (dark variant)
];

export function useAllocPalette(): readonly string[] {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? ALLOC_DARK : ALLOC_LIGHT;
}
