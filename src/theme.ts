import { createTheme, darken, getContrastRatio, lighten, type Theme } from "@mui/material/styles";

/**
 * Tensor Cost design tokens, mirrored from apps/gpu-dashboard-frontend's
 * ThemeContext.jsx so the migration looks identical. Exported as a factory so
 * the shell can swap light/dark at runtime.
 */
export type ThemeMode = "light" | "dark";

// MUI's default `light`/`dark` tonal coefficients (see @mui/material/styles
// augmentColor). We compute shades the same way it would so an arbitrary
// brand colour (orange, green, magenta) gets a coherent palette instead of
// only `palette.primary.main` flipping while hover/active states stay blue.
const TONAL_OFFSET = 0.2;

function deriveContrastText(hex: string): string {
  // 3:1 is WCAG large-text minimum; 4.5:1 is the regular-text minimum. We
  // pick black or white text per primary/secondary so light brand colours
  // don't render white-on-pastel.
  return getContrastRatio(hex, "#FFFFFF") >= 3 ? "#FFFFFF" : "#0F172A";
}

export function createTensorTheme(mode: ThemeMode, overrides?: { primary?: string; secondary?: string }): Theme {
  const isDark = mode === "dark";
  const primary = overrides?.primary ?? "#3B82F6";
  const secondary = overrides?.secondary ?? "#06B6D4";
  const divider = isDark ? "#334155" : "#E2E8F0";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primary,
        light: lighten(primary, TONAL_OFFSET),
        dark: darken(primary, TONAL_OFFSET),
        contrastText: deriveContrastText(primary),
      },
      secondary: {
        main: secondary,
        light: lighten(secondary, TONAL_OFFSET),
        dark: darken(secondary, TONAL_OFFSET),
        contrastText: deriveContrastText(secondary),
      },
      success: { main: "#10B981", light: "#34D399", dark: "#059669" },
      warning: { main: "#F59E0B", light: "#FBBF24", dark: "#D97706" },
      error: { main: "#EF4444", light: "#F87171", dark: "#DC2626" },
      ...(isDark
        ? {
            background: { default: "#0F172A", paper: "#1E293B" },
            text: { primary: "#F1F5F9", secondary: "#CBD5E1", disabled: "#94A3B8" },
            divider,
          }
        : {
            background: { default: "#F1F5F9", paper: "#FFFFFF" },
            text: { primary: "#0F172A", secondary: "#475569", disabled: "#64748B" },
            divider,
          }),
      grey: {
        50: isDark ? "#0F172A" : "#F8FAFC",
        100: isDark ? "#1E293B" : "#F1F5F9",
        200: isDark ? "#334155" : "#E2E8F0",
        300: isDark ? "#475569" : "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: isDark ? "#CBD5E1" : "#334155",
        800: isDark ? "#E2E8F0" : "#1E293B",
        900: isDark ? "#F8FAFC" : "#0F172A",
      },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
      h4: { fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" },
      h5: { fontWeight: 600, fontSize: "1.125rem", letterSpacing: "-0.01em" },
      h6: { fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "-0.01em" },
      overline: { fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.625rem" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: { boxShadow: "none", border: `1px solid ${divider}`, borderRadius: 10 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { boxShadow: "none", border: `1px solid ${divider}`, borderRadius: 10, backgroundImage: "none" },
          elevation0: { border: "none" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            borderRadius: 8,
            padding: "6px 16px",
            "&:focus-visible": { outline: `2px solid ${primary}`, outlineOffset: 2 },
          },
          contained: { boxShadow: "none", "&:hover": { boxShadow: "0 2px 8px rgba(59,130,246,0.25)" } },
          outlined: { borderColor: divider },
          sizeSmall: { padding: "4px 12px", fontSize: "0.75rem" },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, fontSize: "0.6875rem", borderRadius: 6, height: 24 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark ? "#1E293B" : "#FFFFFF",
            color: isDark ? "#F1F5F9" : "#0F172A",
            boxShadow: "none",
            borderBottom: `1px solid ${divider}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            borderRight: `1px solid ${divider}`,
            backgroundImage: "none",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 500, fontSize: "0.8125rem", minHeight: 40 },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { "&:focus-visible": { outline: `2px solid ${primary}`, outlineOffset: 2 } },
        },
      },
      MuiAlert: { styleOverrides: { root: { borderRadius: 8 } } },
    },
  });
}
