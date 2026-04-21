/**
 * MUI theme tokens shared across shell + MFs. Real port of the existing
 * apps/gpu-dashboard-frontend theme lands when the first real MF needs MUI.
 */
export const tokens = {
  light: {
    primary: "#1976d2",
    secondary: "#dc004e",
    background: "#fafafa",
  },
  dark: {
    primary: "#90caf9",
    secondary: "#f48fb1",
    background: "#121212",
  },
};

export type ThemeMode = keyof typeof tokens;
