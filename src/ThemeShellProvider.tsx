import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { createTensorTheme, type ThemeMode } from "./theme.js";

export type ThemeSetting = "system" | "light" | "dark";

interface ThemeModeCtx {
  mode: ThemeMode;
  setting: ThemeSetting;
  toggleTheme(): void;
  setThemeMode(next: ThemeSetting): void;
}

const ThemeModeContext = createContext<ThemeModeCtx | null>(null);

export function useThemeMode(): ThemeModeCtx {
  const v = useContext(ThemeModeContext);
  if (!v) throw new Error("useThemeMode must be used within <ThemeShellProvider>");
  return v;
}

const STORAGE_KEY = "tc.theme-mode";

export interface ThemeShellProviderProps {
  children: ReactNode;
  /** Optional per-tenant branding overrides (from runtime-config). */
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

  const theme = useMemo(
    () => createTensorTheme(mode, { primary: primaryColor, secondary: secondaryColor }),
    [mode, primaryColor, secondaryColor],
  );

  const ctx = useMemo<ThemeModeCtx>(
    () => ({ mode, setting, toggleTheme, setThemeMode }),
    [mode, setting, toggleTheme, setThemeMode],
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
