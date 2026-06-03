/**
 * Shared surface/ink palette for marketing components, derived from the active
 * MUI theme mode (light/dark). Brand accents (blue→cyan, success, etc.) stay
 * constant; only neutral surfaces, text, and borders flip with the mode — so a
 * single source keeps every Phase-5 visual dark-mode aware and consistent.
 */
import { useTheme } from "@mui/material";

export interface Surfaces {
  dark: boolean;
  /** Page / hero surface (white in light, near-black in dark). */
  page: string;
  /** Subtle alternating band (slate-50 in light, raised dark in dark). */
  band: string;
  /** Raised card / panel surface. */
  card: string;
  /** Primary text (near-black / off-white). */
  ink: string;
  /** Secondary text. */
  ink2: string;
  /** Tertiary / muted text. */
  ink3: string;
  /** Hairline borders / dividers. */
  line: string;
  /** Faint mid-grey (chart baselines, dashed lines) — reads in both modes. */
  faint: string;
}

export function useSurfaces(): Surfaces {
  const t = useTheme();
  const dark = t.palette.mode === "dark";
  return {
    dark,
    page: dark ? "#0F172A" : "#FFFFFF",
    band: dark ? "#1E293B" : "#F8FAFC",
    card: dark ? "#1E293B" : "#FFFFFF",
    ink: t.palette.text.primary,
    ink2: t.palette.text.secondary,
    ink3: t.palette.text.disabled,
    line: t.palette.divider,
    faint: dark ? "#64748B" : "#94A3B8",
  };
}
