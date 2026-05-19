import { type ReactNode } from "react";
import { Box, IconButton, Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

// MobileTopBar — navrail primitive (2026-05-19)
//
// Spec: design_handoff_navigation_rail/README.md §Mobile artboards
// Renders below 768px viewport (the host is responsible for the breakpoint;
// this component renders always but is visually appropriate for mobile).
// 50px iOS status bar inset (env(safe-area-inset-top)) + 56px row:
//   left: hamburger icon
//   center: brand mark + tenant chip
//   right: bell + badge
//
// The page title strip below is static here (collapses on scroll in a
// native wrapper but not wired to scroll events in the web component).

export interface MobileTopBarProps {
  title: string;
  subtitle?: string;
  alertsCount: number;
  onMenu: () => void;
  onAlerts?: () => void;
  /**
   * Real logo slot — user feedback 2026-05-19. When provided, the gradient
   * square + "TensorCost" text are replaced with the supplied node. Use
   * <Brand variant="mark" size={24} /> here (mark-only; no room for a lockup
   * in the narrow top bar). Falls back to gradient + text when omitted.
   */
  logoSlot?: ReactNode;
}

export function MobileTopBar({
  title,
  subtitle,
  alertsCount,
  onMenu,
  onAlerts,
  logoSlot,
}: MobileTopBarProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const b = theme.palette.brand;

  const bg = isDark ? "rgba(30,41,59,0.96)" : "rgba(255,255,255,0.96)";
  const border = b?.border ?? (isDark ? "rgba(148,163,184,0.16)" : "#E2E8F0");
  const ink = b?.ink ?? (isDark ? "#F8FAFC" : "#0F172A");
  const ink2 = b?.ink2 ?? (isDark ? "#CBD5E1" : "#475569");
  const blue = b?.blue ?? (isDark ? "#60A5FA" : "#3B82F6");
  const cyan = b?.cyan ?? (isDark ? "#22D3EE" : "#06B6D4");
  const danger = b?.danger ?? (isDark ? "#F87171" : "#EF4444");

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        background: bg,
        borderBottom: `1px solid ${border}`,
        zIndex: 20,
        // iOS safe-area inset for notch / dynamic island devices.
        paddingTop: "env(safe-area-inset-top, 0px)",
        backdropFilter: "saturate(180%)",
        WebkitBackdropFilter: "saturate(180%)",
      }}
    >
      {/* 56px top bar row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 16px 8px",
          height: 56,
          boxSizing: "border-box",
        }}
      >
        {/* Hamburger */}
        <IconButton
          onClick={onMenu}
          aria-label="Open navigation menu"
          edge="start"
          sx={{
            color: ink,
            width: 36,
            height: 36,
            "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Brand + tenant (center) */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
          {logoSlot ?? (
            /* Fallback: gradient mark + text */
            <>
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "5px",
                  background: `linear-gradient(135deg, ${blue} 0%, ${cyan} 100%)`,
                  flexShrink: 0,
                }}
              />
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: ink,
                  letterSpacing: "-0.02em",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                TensorCost
              </Box>
            </>
          )}
        </Box>

        {/* Bell + badge */}
        <IconButton
          onClick={onAlerts}
          aria-label={alertsCount > 0 ? `${alertsCount} alerts` : "Alerts"}
          edge="end"
          sx={{
            color: ink,
            width: 36,
            height: 36,
            "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
          }}
        >
          <Badge
            badgeContent={alertsCount > 0 ? alertsCount : undefined}
            sx={{
              "& .MuiBadge-badge": {
                background: danger,
                color: isDark ? "#0F172A" : "#fff",
                fontSize: 9,
                fontWeight: 700,
                minWidth: 14,
                height: 14,
                padding: "0 4px",
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Page title strip */}
      <Box sx={{ padding: "2px 18px 12px" }}>
        <Box
          component="h1"
          sx={{
            margin: 0,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: ink,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {title}
        </Box>
        {subtitle && (
          <Box
            sx={{
              fontSize: 12,
              color: ink2,
              mt: "2px",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {subtitle}
          </Box>
        )}
      </Box>
    </Box>
  );
}
