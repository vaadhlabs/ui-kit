import { createTheme, darken, getContrastRatio, lighten, type Theme } from "@mui/material/styles";

/**
 * TensorCost design tokens, mirrored from apps/gpu-dashboard-frontend's
 * ThemeContext.jsx so the migration looks identical. Exported as a factory so
 * the shell can swap light/dark at runtime.
 */
export type ThemeMode = "light" | "dark";

// Navrail brand tokens — added 2026-05-19 for the Rail redesign.
// These match the token table in design_handoff_navigation_rail/README.md
// §Design tokens exactly. Exposed on theme.palette.brand.* for component-
// internal use, and as CSS custom properties for legacy non-MUI consumers.
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

declare module "@mui/material/styles" {
  interface Palette {
    brand: BrandTokens;
  }
  interface PaletteOptions {
    brand?: Partial<BrandTokens>;
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

// Navrail brand token sets — values exact per README §Design tokens.
// The theme file wins when values differ from the spec (per README §Fidelity).
// Note: background.default is already #0F172A / #F1F5F9 in dark/light; the
// spec calls bgPage #FAFBFC in light. We keep the existing background.default
// for the MUI layer (#F1F5F9) and put #FAFBFC in brand.bgPage so Rail
// components get the spec value without breaking the rest of the app.
const BRAND_TOKENS_LIGHT: BrandTokens = {
  paper: "#FFFFFF",
  bgPage: "#FAFBFC",
  bgSoft: "#F8FAFC",
  ink: "#0F172A",
  // ink2: was #475569 (slate-600, ~4.5:1 on white — borderline AA).
  // Bumped to #334155 (slate-700, ~7:1) per user contrast feedback 2026-05-19.
  ink2: "#334155",
  // ink3: was #94A3B8 (slate-400, ~3.5:1 on white — fails AA).
  // Bumped to #64748B (slate-500, ~4.6:1) per user contrast feedback 2026-05-19.
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

const BRAND_TOKENS_DARK: BrandTokens = {
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

/**
 * Builds the :root / [data-theme="dark"] CSS custom-property block that
 * non-MUI consumers can read. Generated at theme-creation time so the
 * string is ready for MuiCssBaseline's globalStyles injection.
 */
function buildCssVars(t: BrandTokens): string {
  return `
    --paper: ${t.paper};
    --bgPage: ${t.bgPage};
    --bgSoft: ${t.bgSoft};
    --ink: ${t.ink};
    --ink2: ${t.ink2};
    --ink3: ${t.ink3};
    --ink4: ${t.ink4};
    --border: ${t.border};
    --borderStrong: ${t.borderStrong};
    --bgHover: ${t.bgHover};
    --selected: ${t.selected};
    --blue: ${t.blue};
    --cyan: ${t.cyan};
    --positive: ${t.positive};
    --warn: ${t.warn};
    --danger: ${t.danger};
    --purple: ${t.purple};
    --radius-sm: ${t.radiusSm};
    --radius-md: ${t.radiusMd};
    --radius-lg: ${t.radiusLg};
    --radius-xl: ${t.radiusXl};
    --radius-pill: ${t.radiusPill};
  `.trim();
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
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
      h4: { fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" },
      h5: { fontWeight: 600, fontSize: "1.125rem", letterSpacing: "-0.01em" },
      h6: { fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "-0.01em" },
      overline: { fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.625rem" },
      button: { textTransform: "none", fontWeight: 600 },
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
          // Load JetBrains Mono if the browser hasn't already fetched it.
          // The CSP in security-headers.middleware.ts already allows
          // fonts.googleapis.com and fonts.gstatic.com.
          "@import": [
            "url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap')",
          ],
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
