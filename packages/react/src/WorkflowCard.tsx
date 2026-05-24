import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Box } from "@mui/material";
import { useTheme, alpha, type Theme } from "@mui/material/styles";
import { StatusBadge, type StatusBadgeKind } from "./StatusBadge.js";

// WorkflowCard — navrail primitive (2026-05-19, chrome revised 2026-05-24)
//
// Spec: design_handoff_navigation_rail/README.md §Workflow card anatomy
// Flat-card chrome: background.paper surface, 1px divider border, 12px radius.
// No gradient, no top-stripe. When a status is present, a 4px left-edge
// accent stripe appears in the status palette color (success/warning/error/info).
//
// Focus ring: box-shadow 0 0 0 4px primary.main at 22% alpha. Fades 300ms
// after 4s of no interaction with the card.

export interface WorkflowCardStatus {
  kind: StatusBadgeKind;
  text: string;
}

export interface WorkflowCardProps {
  /** Anchor id for deep-link scrolling. Renders <a id={anchor}>. */
  anchor?: string;
  title: string;
  subtitle?: string;
  /** Right-aligned StatusBadge in the card header. */
  status?: WorkflowCardStatus;
  /** Whether this card currently has focus-ring treatment. */
  focus?: boolean;
  children?: ReactNode;
}

// FOCUS_IDLE_MS: how long after the last interaction before the ring fades.
const FOCUS_IDLE_MS = 4_000;
// FOCUS_FADE_MS: duration of the fade-out animation per spec §Motion.
const FOCUS_FADE_MS = 300;

// Maps StatusBadgeKind to the palette color for the left-edge accent stripe.
function statusAccentColor(kind: StatusBadgeKind, theme: Theme): string {
  switch (kind) {
    case "ok":     return theme.palette.success.main;
    case "warn":   return theme.palette.warning.main;
    case "danger": return theme.palette.error.main;
    case "info":
    default:       return (theme.palette as unknown as { info?: { main: string } }).info?.main ?? theme.palette.primary.main;
  }
}

export function WorkflowCard({
  anchor,
  title,
  subtitle,
  status,
  focus = false,
  children,
}: WorkflowCardProps): ReactElement {
  const theme = useTheme();

  // ringVisible tracks whether the focus-ring glow is at full opacity.
  // Starts true when focus=true, then fades after FOCUS_IDLE_MS of no
  // interaction on the card.
  const [ringVisible, setRingVisible] = useState(focus);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync ringVisible when the focus prop flips externally (e.g. hash nav).
  useEffect(() => {
    setRingVisible(focus);
    if (!focus) return;

    scheduleRingFade();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  function scheduleRingFade() {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setRingVisible(false);
    }, FOCUS_IDLE_MS);
  }

  // Any interaction on the card resets the idle timer.
  function handleInteraction() {
    if (!focus) return;
    setRingVisible(true);
    scheduleRingFade();
  }

  const accentColor = status ? statusAccentColor(status.kind, theme) : null;

  const boxShadow = focus && ringVisible
    ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.22)}`
    : "none";

  return (
    <>
      {/* Anchor element for deep-link scrolling. scrollMarginTop accounts
          for the 140px sticky page header as spec §Workflow cards. */}
      {anchor && (
        <a
          id={anchor}
          style={{ scrollMarginTop: 140, display: "block", height: 0, overflow: "hidden" }}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      <Box
        component="section"
        onMouseMove={handleInteraction}
        onKeyDown={handleInteraction}
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${Number(theme.shape.borderRadius) * 1.5}px`,
          padding: "22px",
          // Smooth focus ring transition
          transition: [
            `box-shadow ${
              ringVisible
                ? "150ms cubic-bezier(0.4,0,0.2,1)"
                : `${FOCUS_FADE_MS}ms ease-out`
            }`,
          ].join(", "),
          boxShadow,
        }}
        aria-label={title}
      >
        {/* 4px left-edge accent stripe — only when a status is present.
            Neutral cards (no status) render with no chrome accent at all. */}
        {accentColor && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              bgcolor: accentColor,
            }}
          />
        )}

        {/* Card header: title + subtitle + status badge.
            Left-pad by 12px when the accent stripe is present so the title
            doesn't sit flush against it. */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: "14px",
            pl: accentColor ? "12px" : 0,
          }}
        >
          <Box>
            <Box
              component="h2"
              sx={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "text.primary",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {title}
            </Box>
            {subtitle && (
              <Box
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                  mt: "2px",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                {subtitle}
              </Box>
            )}
          </Box>
          {status && <StatusBadge kind={status.kind} text={status.text} />}
        </Box>

        {/* Children sit inside the content area, left-padded when stripe is present. */}
        <Box sx={{ pl: accentColor ? "12px" : 0 }}>
          {children}
        </Box>
      </Box>
    </>
  );
}
