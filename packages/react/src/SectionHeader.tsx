import { Box, Typography } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

/**
 * Workshop section-header pattern: 28px h2 title with optional subtitle
 * and an optional right-aligned action slot.
 *
 *   Real-time view of every workload          [time-window pill]
 *
 * Section identity is carried by WorkshopCard's accent ribbon, not by
 * a dot+kicker eyebrow above the title. The earlier design had an
 * uppercase kicker bullet in the section accent colour ("• OBSERVE")
 * directly above the h2; that was deliberately removed — it duplicated
 * the colour signal that WorkshopCard already provides and read as
 * noise once every page carried one. The `kicker` prop survives the
 * change as a no-op to keep the ~120 existing call sites valid without
 * a sweep; callers can drop it lazily in their next edit.
 */
export interface SectionHeaderProps {
  /** Deprecated — no longer rendered. Section accent is carried by
   *  WorkshopCard's ribbon. Left in the prop signature so existing
   *  call sites continue to type-check without a global rewrite. */
  kicker?: string;
  /** Required h2 title. */
  title: string;
  /** Optional subtitle below the title — sentence case, 15px. */
  subtitle?: string;
  /** Optional right-aligned action slot for time-window toggles, view
   *  switchers, or a primary CTA. */
  action?: ReactNode;
  /**
   * HTML heading element to render for the title. Defaults to "h2".
   * Pass "h1" on drill-down pages that have no WorkflowPage wrapper
   * so the document always has exactly one h1 landmark.
   */
  headingLevel?: "h1" | "h2" | "h3";
}

export function SectionHeader({
  title,
  subtitle,
  action,
  headingLevel = "h2",
}: SectionHeaderProps): ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        // On xs, the action slot stacks below the title to avoid the action
        // chip overlaying a wrapped title — fixes the mobile overlap bug
        // surfaced on /enforcement where "+ New policy" was sitting on top
        // of "Enforcement Policies" wrapping to two lines.
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "flex-start" },
        justifyContent: "space-between",
        gap: { xs: 1.5, sm: 3 },
        mb: 3,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h2"
          component={headingLevel}
          sx={{
            color: "text.primary",
            mb: subtitle ? 0.5 : 0,
            // Workshop h2 defaults to 28px which is loud on a 375px-wide
            // mobile viewport — section titles dominate the card content
            // they introduce. Scale down to 20px on xs so the title
            // anchors the section without competing with it.
            fontSize: { xs: "1.25rem", md: "1.75rem" },
            lineHeight: { xs: 1.2, md: 1.15 },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: "60ch",
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Box
          sx={{
            // On sm+ the action is right-aligned next to the title; on xs it
            // stacks below the subtitle. flexShrink:0 prevents the slot from
            // being squeezed when the title is long.
            flexShrink: 0,
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
}
