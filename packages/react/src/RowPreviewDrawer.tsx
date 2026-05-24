import { useEffect, type ReactNode } from "react";
import { Box, ButtonBase, IconButton, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close as CloseIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";

// RowPreviewDrawer — navrail primitive (2026-05-19)
//
// Spec: design_handoff_navigation_rail/README.md §Components (§5B)
// Slide-over from the right. 420px wide on desktop, full-width on mobile
// (<768px). Triggered by row click in data tables across all destinations.
//
// Header: title (+ optional subtitle) on the left, "Open page →" CTA on
// the right that fires onOpenPage for deep navigation.
// Body: arbitrary children (row preview content).
//
// Animation: same easing as MobileDrawer — translateX(100%) → 0 on open,
// reverse on close. 240ms open / 200ms close per spec §Motion.

export interface RowPreviewDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onOpenPage: () => void;
  children?: ReactNode;
}

export function RowPreviewDrawer({
  open,
  title,
  subtitle,
  onClose,
  onOpenPage,
  children,
}: RowPreviewDrawerProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const b = theme.palette.brand;

  const paper = b?.paper ?? (isDark ? "#1E293B" : "#FFFFFF");
  const border = b?.border ?? (isDark ? "rgba(148,163,184,0.16)" : "#E2E8F0");
  const ink = b?.ink ?? (isDark ? "#F8FAFC" : "#0F172A");
  const ink2 = b?.ink2 ?? (isDark ? "#CBD5E1" : "#475569");
  const ink3 = b?.ink3 ?? (isDark ? "#94A3B8" : "#94A3B8");
  const blue = b?.blue ?? (isDark ? "#60A5FA" : "#3B82F6");
  const motionOpen = b?.motionDrawerOpen ?? "240ms cubic-bezier(0.4,0,0.2,1)";
  const motionClose = b?.motionDrawerClose ?? "200ms cubic-bezier(0.4,0,0.2,1)";
  const transition = open ? motionOpen : motionClose;

  // ESC to close.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        pointerEvents: open ? "auto" : "none",
      }}
      aria-hidden={!open}
    >
      {/* Scrim — subtle, not as heavy as the drawer scrim */}
      <Box
        onClick={onClose}
        aria-label="Close preview"
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,23,42,0.32)",
          opacity: open ? 1 : 0,
          transition: `opacity ${transition}`,
        }}
      />

      {/* Slide-over panel from right */}
      <Box
        component="aside"
        aria-label={`Preview: ${title}`}
        aria-modal={open}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          // 420px on desktop, full-width on mobile
          width: { xs: "100%", sm: 420 },
          background: paper,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(15,23,42,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: `transform ${transition}`,
          fontFamily: "'Inter', system-ui, sans-serif",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${border}`,
          }}
        >
          {/* Title + subtitle */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              component="h2"
              sx={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: ink,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
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
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {subtitle}
              </Box>
            )}
          </Box>

          {/* Action buttons: "Open page →" + close */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px", ml: "12px", flexShrink: 0 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={onOpenPage}
              endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
              aria-label={`Open full page for ${title}`}
              sx={{
                borderColor: border,
                color: blue,
                fontSize: 12,
                fontWeight: 600,
                borderRadius: "8px",
                padding: "4px 12px",
                textTransform: "none",
                "&:hover": { borderColor: blue, background: `${blue}0a` },
                "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
              }}
            >
              Open page
            </Button>
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Close preview"
              sx={{
                color: ink3,
                padding: "4px",
                "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Body — arbitrary children */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
