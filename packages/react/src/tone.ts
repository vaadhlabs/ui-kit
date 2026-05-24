import { useTheme } from "@mui/material/styles";
import { TONE_DARK, TONE_LIGHT } from "@tensorcost/tokens";

// Re-export types so consumers that do `import { ToneKind } from "@tensorcost/ui-kit"`
// still get them without an additional import.
export type { ToneKind, ToneTokens } from "@tensorcost/tokens";

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
export function useTone(): Record<import("@tensorcost/tokens").ToneKind, import("@tensorcost/tokens").ToneTokens> {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? TONE_DARK : TONE_LIGHT;
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
