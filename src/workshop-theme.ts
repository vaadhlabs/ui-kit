import { createTheme, darken, lighten, type Theme } from "@mui/material/styles";

/**
 * Workshop theme (Stripe / Notion direction) — the second visual language
 * added to the ui-kit alongside the default `createTensorTheme`.
 *
 * Why a separate factory rather than a mode of the existing theme:
 * the two are intentionally incompatible. Different border radii (12 vs
 * 8), different typography scale (44px hero h1 vs 24px h4), different
 * KPI card pattern (top-ribbon section identity vs icon badge). Mixing
 * them in one render tree produces visual chaos.
 *
 * Shells that want to use Workshop wrap a route subtree (or a whole MF)
 * in `<ThemeProvider theme={createWorkshopTheme(...)}>`. The default
 * theme keeps powering everything else until each surface explicitly
 * migrates.
 *
 * Per-section identity colour
 * ---------------------------
 * The thing that makes Workshop differentiated is the 4-color section
 * palette. Cards, page kickers, nav active states, pill buttons — each
 * inherits the colour of its containing section so users learn "Observe
 * is blue" rather than reading the section name every time.
 *
 * The colour itself is exposed as `theme.palette.workshop.section.*`
 * but consumers shouldn't hard-code which is which. Instead they wrap
 * their tree in `<SectionProvider section="observe">` (from
 * `./section.tsx`) and read the current section's tint via
 * `useSection()`. That keeps section assignment a single explicit
 * decision per route, not a string scattered across every component.
 *
 * Light + dark variants exist for the same reason the default theme
 * has them: customer preference. Workshop is light-first but engineers
 * who used the dark dashboard for weeks will notice if we drop dark
 * entirely. The dark variant keeps the section-color thread (with
 * higher-saturation tints to read on dark surfaces) so the design
 * language is consistent.
 */

export type WorkshopMode = "light" | "dark";

/** The four sections the IA already has — Observe / Optimize / Operations / Govern. */
export type Section = "observe" | "optimize" | "operations" | "govern";

/** Per-section accent + tint. Tint is a 6-12% solid-on-bg used for
 *  ribbon corners, nav active backgrounds, and card-header washes. */
interface SectionTokens {
  accent: string;
  tint: string;
}

/** Module-augmentation: every component can read
 *  `theme.palette.workshop.section.observe.accent` etc. */
declare module "@mui/material/styles" {
  interface Palette {
    workshop: {
      section: Record<Section, SectionTokens>;
      /** Page background a notch off-white (warm) so Card paper
       *  surfaces have visible contrast at the edge. */
      pageBg: string;
      /** Totals row tint, table footer, callout boxes. */
      surfaceAlt: string;
    };
  }
  interface PaletteOptions {
    workshop?: {
      section?: Record<Section, SectionTokens>;
      pageBg?: string;
      surfaceAlt?: string;
    };
  }
}

const SECTION_TOKENS_LIGHT: Record<Section, SectionTokens> = {
  observe: { accent: "#2563EB", tint: "#EFF6FF" },
  optimize: { accent: "#0F766E", tint: "#F0FDFA" },
  operations: { accent: "#7C3AED", tint: "#F5F3FF" },
  govern: { accent: "#B45309", tint: "#FFFBEB" },
};

const SECTION_TOKENS_DARK: Record<Section, SectionTokens> = {
  // Dark variant: keep the hue identifiable but boost luminance so the
  // accent reads on a dark surface, and swap the tint to a translucent
  // overlay so it actually sits ABOVE the panel rather than blending in.
  observe: { accent: "#60A5FA", tint: "rgba(96,165,250,0.10)" },
  optimize: { accent: "#5EEAD4", tint: "rgba(94,234,212,0.10)" },
  operations: { accent: "#A78BFA", tint: "rgba(167,139,250,0.10)" },
  govern: { accent: "#FBBF24", tint: "rgba(251,191,36,0.10)" },
};

const TONAL_OFFSET = 0.2;

/**
 * Optional per-tenant brand overrides. The shell calls this with the
 * tenant's branding colours so a white-labeled deployment can keep
 * its primary/secondary while still picking up the Workshop layout,
 * type scale, and section tokens. If overrides are omitted the theme
 * defaults to Workshop's own observe-blue / optimize-teal pair.
 */
export interface WorkshopOverrides {
  primary?: string;
  secondary?: string;
}

export function createWorkshopTheme(
  mode: WorkshopMode = "light",
  overrides: WorkshopOverrides = {},
): Theme {
  const isDark = mode === "dark";
  const section = isDark ? SECTION_TOKENS_DARK : SECTION_TOKENS_LIGHT;
  const primary = overrides.primary ?? "#2563EB"; // Observe (brand) by default
  const secondary = overrides.secondary ?? section.optimize.accent;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primary,
        light: lighten(primary, TONAL_OFFSET),
        dark: darken(primary, TONAL_OFFSET),
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: secondary,
        contrastText: "#FFFFFF",
      },
      success: { main: isDark ? "#34D399" : "#15803D" },
      warning: { main: isDark ? "#FBBF24" : "#B45309" },
      error: { main: isDark ? "#FB7185" : "#BE123C" },
      ...(isDark
        ? {
            background: { default: "#0E1116", paper: "#161B22" },
            text: { primary: "#E6EDF3", secondary: "#9BA8B8", disabled: "#586675" },
            divider: "#1F2937",
          }
        : {
            background: { default: "#FAFAF7", paper: "#FFFFFF" },
            text: { primary: "#1A1A1A", secondary: "#5C5A52", disabled: "#8E8B7F" },
            divider: "#E7E4DC",
          }),
      workshop: {
        section,
        pageBg: isDark ? "#0E1116" : "#FAFAF7",
        surfaceAlt: isDark ? "#1F2937" : "#F4F2EC",
      },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
      // Workshop type scale is more expressive than the default. Hero
      // page titles want presence — 44px so a CFO landing on the page
      // sees the number, not the chrome. Card titles drop to 16px
      // because the surrounding white space carries the hierarchy
      // (Workshop trades density for breathing room).
      h1: { fontWeight: 700, fontSize: "2.75rem", letterSpacing: "-0.025em", lineHeight: 1.1 }, // 44px page title
      h2: { fontWeight: 700, fontSize: "1.75rem", letterSpacing: "-0.02em", lineHeight: 1.15 }, // 28px section
      h3: { fontWeight: 600, fontSize: "1.25rem", letterSpacing: "-0.01em" },                    // 20px
      h4: { fontWeight: 600, fontSize: "1.125rem", letterSpacing: "-0.01em" },                  // 18px
      h5: { fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.005em" },                     // 16px
      h6: { fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" },                      // 16px card title
      body1: { fontSize: "0.9375rem", lineHeight: 1.55 },                                       // 15px
      body2: { fontSize: "0.8125rem", lineHeight: 1.5 },                                        // 13px
      // Page-kicker pattern: small uppercase label above an h1 in the
      // section colour (rendered by the page component, not the theme).
      overline: {
        fontWeight: 700,
        letterSpacing: "0.10em",
        fontSize: "0.6875rem",
        textTransform: "uppercase",
        lineHeight: 1,
      },
      button: { textTransform: "none", fontWeight: 600 },
    },
    // 12px is the Workshop default; chips at 10, buttons mix 10 (square)
    // and 999 (pill) per usage. Hero cards (KPI strips) bump to 14.
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? "#0E1116" : "#FAFAF7",
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? "#1F2937" : "#E7E4DC"}`,
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 10 },
          // Pill variant — opt-in via `<Button sx={{ borderRadius: 999 }}>`,
          // not a separate MUI variant, so the styling stays inspectable.
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 10, fontWeight: 600 },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-head": {
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "0.6875rem",
              color: isDark ? "#9BA8B8" : "#5C5A52",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? "#1F2937" : "#EFECE3"}`,
            padding: "14px 16px",
          },
        },
      },
    },
  });
}
