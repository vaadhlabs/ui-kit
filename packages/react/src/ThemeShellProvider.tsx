import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { type ThemeMode } from "./theme.js";
import { createWorkshopTheme } from "./workshop-theme.js";

export type ThemeSetting = "system" | "light" | "dark";

export interface BrandColors {
  primary?: string;
  secondary?: string;
}

interface ThemeModeCtx {
  mode: ThemeMode;
  setting: ThemeSetting;
  toggleTheme(): void;
  setThemeMode(next: ThemeSetting): void;
  /**
   * Apply per-tenant branding colours discovered AFTER the provider mounted.
   * The shell calls this once `loadRuntimeConfig()` resolves with the
   * tenant's `branding.primaryColor` / `branding.secondaryColor`. Pass
   * undefined for either to fall back to the boot-time defaults (the
   * `primaryColor` / `secondaryColor` props this provider was rendered
   * with).
   */
  setBrandColors(next: BrandColors): void;
}

const ThemeModeContext = createContext<ThemeModeCtx | null>(null);

const NOOP_THEME_CTX: ThemeModeCtx = {
  mode: "light",
  setting: "light",
  toggleTheme: () => {},
  setThemeMode: () => {},
  setBrandColors: () => {},
};

/**
 * Returns the active theme context. Outside a `<ThemeShellProvider>` it
 * falls back to a fixed light-mode no-op context so MFs can render
 * standalone (e.g. in vitest, in a Storybook frame) without forcing every
 * test to mount the shell provider.
 */
export function useThemeMode(): ThemeModeCtx {
  return useContext(ThemeModeContext) ?? NOOP_THEME_CTX;
}

const STORAGE_KEY = "tc.theme-mode";

export interface ThemeShellProviderProps {
  children: ReactNode;
  /** Boot-time branding defaults. Used until `setBrandColors` is called. */
  primaryColor?: string;
  secondaryColor?: string;
  /** Default setting when the user hasn't chosen one yet. */
  defaultSetting?: ThemeSetting;
}

export function ThemeShellProvider({
  children,
  primaryColor,
  secondaryColor,
  defaultSetting = "system",
}: ThemeShellProviderProps): JSX.Element {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", { noSsr: true });

  const [setting, setSetting] = useState<ThemeSetting>(() => {
    if (typeof localStorage === "undefined") return defaultSetting;
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeSetting | null;
    return stored ?? defaultSetting;
  });

  // Runtime brand colour overrides. Initialised from the props (boot-time
  // defaults) and updated when the shell calls `setBrandColors` after
  // runtime-config arrives. 26-FCR §2.15 / Audit P0-8.
  const [brand, setBrand] = useState<BrandColors>(() => ({
    primary: primaryColor,
    secondary: secondaryColor,
  }));

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    if (setting === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, setting);
  }, [setting]);

  const mode: ThemeMode = setting === "system" ? (prefersDark ? "dark" : "light") : setting;

  const setThemeMode = useCallback((next: ThemeSetting): void => setSetting(next), []);
  const toggleTheme = useCallback((): void => {
    setSetting((prev) => (prev === "system" ? "light" : prev === "light" ? "dark" : "system"));
  }, []);
  const setBrandColors = useCallback((next: BrandColors): void => {
    setBrand({
      primary: next.primary ?? primaryColor,
      secondary: next.secondary ?? secondaryColor,
    });
  }, [primaryColor, secondaryColor]);

  // Workshop is now the app-wide default theme — every MF rendered
  // inside the shell inherits its type scale (44px hero h1), 12px
  // border radius, hairline-bordered Card surface, and section
  // token palette. Per-tenant brand overrides still flow through
  // so a white-labeled deployment keeps its primary / secondary.
  // Individual pages that previously wrapped in createWorkshopTheme
  // (dashboard, CFO, login) keep their wrappers as a no-op safety
  // net for standalone rendering (vitest, Storybook).
  const theme = useMemo(
    () => createWorkshopTheme(mode, { primary: brand.primary, secondary: brand.secondary }),
    [mode, brand.primary, brand.secondary],
  );

  const ctx = useMemo<ThemeModeCtx>(
    () => ({ mode, setting, toggleTheme, setThemeMode, setBrandColors }),
    [mode, setting, toggleTheme, setThemeMode, setBrandColors],
  );

  return (
    <ThemeModeContext.Provider value={ctx}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}
