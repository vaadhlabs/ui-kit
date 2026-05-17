import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useSection } from "./section.js";

/**
 * Workshop section-header pattern: small uppercase kicker in the
 * section accent colour above a 28px h2 title, with optional eyebrow
 * actions on the right edge.
 *
 *   OBSERVE
 *   Real-time view of every workload          [time-window pill]
 *
 * Both kicker + bullet pull their colour from `useSection()` so the
 * same component drops into any section page and adopts the local
 * identity automatically. Outside a SectionProvider, the kicker falls
 * back to the theme primary and looks like a generic page header —
 * which is the right behaviour for shell-level pages that aren't part
 * of any section.
 */
export interface SectionHeaderProps {
  /** Tiny uppercase eyebrow above the title. Typically the section
   *  name in uppercase ("OBSERVE", "OPTIMIZE", etc) but consumers can
   *  override per page. */
  kicker?: string;
  /** Required h2 title. */
  title: string;
  /** Optional subtitle below the title — sentence case, 15px. */
  subtitle?: string;
  /** Optional right-aligned action slot for time-window toggles, view
   *  switchers, or a primary CTA. */
  action?: ReactNode;
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
  action,
}: SectionHeaderProps): JSX.Element {
  const { accent } = useSection();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 3,
        mb: 3,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {kicker && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {/* Section bullet — 8px circle in the accent colour. Sits
               to the left of the kicker so the colour identity is the
               first thing the eye lands on. */}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accent,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="overline"
              sx={{ color: accent, lineHeight: 1, fontWeight: 700 }}
            >
              {kicker}
            </Typography>
          </Box>
        )}
        <Typography variant="h2" sx={{ color: "text.primary", mb: subtitle ? 0.5 : 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "60ch" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
