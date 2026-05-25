/**
 * v2 BlueprintThemeProvider + usePalette / useBlueprintTheme hooks.
 *
 * Single source of truth for the active blueprint palette so primitives
 * stop hard-importing BLUEPRINT_LIGHT. The shell mounts the provider
 * once with the user's preferred mode (light / dark), and every
 * blueprint primitive inside reads from it via `usePalette()`.
 *
 * Default mode is "light" — consumers without the provider get the
 * existing behaviour (warm vellum + near-black ink). Existing code
 * that imports BLUEPRINT_LIGHT directly keeps working; the provider
 * is opt-in.
 */
import * as React from "react";
import {
  BLUEPRINT_DARK,
  BLUEPRINT_LIGHT,
  type BlueprintPalette,
} from "@tensorcost/tokens";

export type BlueprintMode = "light" | "dark";

export interface BlueprintThemeContextValue {
  mode: BlueprintMode;
  palette: BlueprintPalette;
}

const BlueprintThemeContext = React.createContext<BlueprintThemeContextValue>({
  mode: "light",
  palette: BLUEPRINT_LIGHT,
});
BlueprintThemeContext.displayName = "BlueprintThemeContext";

export interface BlueprintThemeProviderProps {
  /** Active palette mode. */
  mode: BlueprintMode;
  /** Override the palette directly (e.g. for tenant-branded variants).
   *  When supplied, `mode` is informational only and the override wins. */
  palette?: BlueprintPalette;
  children: React.ReactNode;
}

export function BlueprintThemeProvider({
  mode,
  palette,
  children,
}: BlueprintThemeProviderProps): React.ReactElement {
  const resolved = React.useMemo<BlueprintThemeContextValue>(
    () => ({
      mode,
      palette: palette ?? (mode === "dark" ? BLUEPRINT_DARK : BLUEPRINT_LIGHT),
    }),
    [mode, palette],
  );
  return React.createElement(
    BlueprintThemeContext.Provider,
    { value: resolved },
    children,
  );
}

/** Read the active palette. Falls back to BLUEPRINT_LIGHT when no
 *  provider is mounted (preserves backward-compat with consumers that
 *  hard-imported BLUEPRINT_LIGHT before the provider existed). */
export function usePalette(): BlueprintPalette {
  return React.useContext(BlueprintThemeContext).palette;
}

/** Read the full theme value (mode + palette). */
export function useBlueprintTheme(): BlueprintThemeContextValue {
  return React.useContext(BlueprintThemeContext);
}
