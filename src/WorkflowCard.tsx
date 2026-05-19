import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { StatusBadge, type StatusBadgeKind } from "./StatusBadge.js";

// WorkflowCard — navrail primitive (2026-05-19)
//
// Spec: design_handoff_navigation_rail/README.md §Workflow card anatomy
// Container styled per spec: paper bg, 1px border, 12px radius, 22px padding.
// No numeric step badge — per user override (dropped entirely).
// Focus ring: blue border + 4px outer glow at 22% alpha.
// Fades out 300ms after 4s of no interaction.

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

export function WorkflowCard({
  anchor,
  title,
  subtitle,
  status,
  focus = false,
  children,
}: WorkflowCardProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const brand = theme.palette.brand;
  const blue = brand?.blue ?? "#3B82F6";

  // ringVisible tracks whether the focus-ring glow is at full opacity.
  // It starts true when focus=true, then fades after FOCUS_IDLE_MS of no
  // interaction on the card.
  const [ringVisible, setRingVisible] = useState(focus);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync ringVisible when the focus prop flips externally (e.g. hash nav).
  useEffect(() => {
    setRingVisible(focus);
    if (!focus) return;

    // Start the idle countdown when focus is granted.
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

  const borderColor = focus ? blue : (brand?.border ?? "#E2E8F0");
  const glowAlpha = isDark ? "29" : "38"; // 0x22 = 34 dec, ~13%; 0x38 = 56, ~22%
  const boxShadow = focus && ringVisible
    ? `0 0 0 4px ${blue}${glowAlpha}`
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
          background: brand?.paper ?? "#FFFFFF",
          border: `1px solid ${borderColor}`,
          borderRadius: brand?.radiusXl ?? "12px",
          padding: "22px",
          // Smooth border color transition for focus-ring on/off per spec §Motion
          transition: [
            `border-color ${brand?.motionFast ?? "150ms cubic-bezier(0.4,0,0.2,1)"}`,
            `box-shadow ${
              ringVisible
                ? brand?.motionFast ?? "150ms cubic-bezier(0.4,0,0.2,1)"
                : `${FOCUS_FADE_MS}ms ease-out`
            }`,
          ].join(", "),
          boxShadow,
        }}
        aria-label={title}
      >
        {/* Card header: title + subtitle + status badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: "14px",
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
                color: brand?.ink ?? "#0F172A",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {title}
            </Box>
            {subtitle && (
              <Box
                sx={{
                  fontSize: 12,
                  color: brand?.ink2 ?? "#475569",
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
        {children}
      </Box>
    </>
  );
}
