import { useTheme } from "@mui/material/styles";
import { Box, type SxProps, type Theme } from "@mui/material";

// StatusBadge — navrail primitive (2026-05-19)
//
// Spec: design_handoff_navigation_rail/README.md §Components
// 22px tall pill. Light: light background + dark foreground per token.
// Dark: semi-transparent tinted background + light foreground per token.

export type StatusBadgeKind = "ok" | "warn" | "info" | "danger";

export interface StatusBadgeProps {
  kind: StatusBadgeKind;
  text: string;
}

interface BadgeColors {
  bg: string;
  fg: string;
}

function useBadgeColors(kind: StatusBadgeKind, isDark: boolean): BadgeColors {
  switch (kind) {
    case "ok":
      return isDark
        ? { bg: "rgba(52,211,153,0.15)",  fg: "#34D399" }
        : { bg: "#ECFDF5",                fg: "#047857" };
    case "warn":
      return isDark
        ? { bg: "rgba(251,191,36,0.15)",  fg: "#FBBF24" }
        : { bg: "#FFFBEB",                fg: "#B45309" };
    case "danger":
      return isDark
        ? { bg: "rgba(248,113,113,0.15)", fg: "#F87171" }
        : { bg: "#FEF2F2",                fg: "#B91C1C" };
    case "info":
    default:
      return isDark
        ? { bg: "rgba(96,165,250,0.15)",  fg: "#60A5FA" }
        : { bg: "#EFF6FF",                fg: "#1D4ED8" };
  }
}

export function StatusBadge({ kind, text }: StatusBadgeProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { bg, fg } = useBadgeColors(kind, isDark);

  const pillSx: SxProps<Theme> = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: 22,
    px: "8px",
    background: bg,
    color: fg,
    borderRadius: "999px",
    fontSize: 11,
    fontWeight: 500,
    whiteSpace: "nowrap",
    // Status changes from ok → warn cross-fade in 600ms per spec §Motion
    transition: "background 600ms linear, color 600ms linear",
  };

  return (
    <Box
      component="span"
      sx={pillSx}
      // aria-live so screen readers announce status changes as they happen
      aria-live="polite"
      aria-label={`Status: ${kind} — ${text}`}
      role="status"
    >
      {/* dot indicator */}
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: fg,
          flexShrink: 0,
        }}
      />
      {text}
    </Box>
  );
}
