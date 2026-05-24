import { createTheme, darken, getContrastRatio, lighten, type Theme } from "@mui/material/styles";
import {
  BRAND_TOKENS_DARK,
  BRAND_TOKENS_LIGHT,
  TYPOGRAPHY_TOKENS,
  buildCssVars,
} from "@tensorcost/tokens";

// Re-export so downstream consumers that do `import { BrandTokens } from "@tensorcost/ui-kit"`
// still get the type without an extra import.
export type { BrandTokens } from "@tensorcost/tokens";

/**
 * TensorCost design tokens, mirrored from apps/gpu-dashboard-frontend's
 * ThemeContext.jsx so the migration looks identical. Exported as a factory so
 * the shell can swap light/dark at runtime.
 */
export type ThemeMode = "light" | "dark";

declare module "@mui/material/styles" {
  interface Palette {
    brand: import("@tensorcost/tokens").BrandTokens;
  }
  interface PaletteOptions {
    brand?: Partial<import("@tensorcost/tokens").BrandTokens>;
  }
}

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
  const brand = isDark ? BRAND_TOKENS_DARK : BRAND_TOKENS_LIGHT;

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
            // secondary was #475569; bumped to #334155 to match ink2 token.
            text: { primary: "#0F172A", secondary: "#334155", disabled: "#64748B" },
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
      brand,
    },
    typography: {
      fontFamily: TYPOGRAPHY_TOKENS.fontFamily,
      h4: TYPOGRAPHY_TOKENS.h4,
      h5: TYPOGRAPHY_TOKENS.h5,
      h6: TYPOGRAPHY_TOKENS.h6,
      overline: TYPOGRAPHY_TOKENS.overline,
      // MUI's typography.button expects `textTransform` as a CSSObject value.
      // The token stores "none" as a plain string — cast is safe since MUI
      // accepts it and the compile-time type is just `string`.
      button: TYPOGRAPHY_TOKENS.button as { textTransform: "none"; fontWeight: number },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Inject CSS custom properties so non-MUI consumers can read them.
          // Light is :root; dark is [data-theme="dark"] on the html element
          // (the shell sets this attribute when switching modes).
          ":root": buildCssVars(BRAND_TOKENS_LIGHT),
          '[data-theme="dark"]': buildCssVars(BRAND_TOKENS_DARK),
          // JetBrains Mono is NOT loaded here. MUI 7 removed the undocumented
          // "@import" shorthand in MuiCssBaseline.styleOverrides, so injecting
          // a font via that key silently does nothing in v7. More importantly,
          // a shared component library should not own the font-loading strategy
          // of its consumers — some apps bundle fonts, others use a CDN link,
          // others have a stricter CSP than fonts.googleapis.com.
          //
          // Consumers must load JetBrains Mono themselves. The canonical font
          // stack is in @tensorcost/tokens as `BrandTokens.mono`. The simplest
          // HTML approach:
          //
          //   <link rel="preconnect" href="https://fonts.googleapis.com" />
          //   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          //   <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
          //
          // See "Consumer setup" in the ui-kit README for the full options.
        },
      },
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
