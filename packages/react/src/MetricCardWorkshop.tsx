import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import type { ReactElement } from "react";
import { useSection } from "./section.js";

/**
 * Workshop-flavored KPI card. Three differences from the default
 * `MetricCard`:
 *
 *   1. 3px top ribbon in the surrounding section's identity colour
 *      (`useSection().accent`). Outside a SectionProvider the ribbon
 *      collapses to a hairline divider so the card still reads cleanly.
 *   2. Radial gradient corner wash in the same colour, low-alpha
 *      (~14%), positioned at the top-right. Subtle on light, more
 *      visible on dark.
 *   3. Hero display number (40px on light, 32px on dark to read against
 *      the higher-contrast background) instead of the default 24px h5.
 *      Section-color accent on the delta string when supplied.
 *
 * No icon badge — Workshop is typography-led, not iconography-led.
 * Consumers that want an icon should drop a small one in the header
 * row via a custom `<Card>` rather than reach for this primitive.
 *
 * `tone` semantically tags the delta direction (good/bad/neutral) so
 * the same component can flip the delta colour without callers
 * conditionally importing red / green hex codes.
 */
export interface MetricCardWorkshopProps {
  label: string;
  value: string | number;
  /** Optional secondary line — sub-label, comparison, footnote. */
  caption?: string;
  /** Optional signed delta string, e.g. "+4.2%" / "-$1.2k". */
  delta?: string;
  tone?: "good" | "bad" | "neutral";
}

export function MetricCardWorkshop({
  label,
  value,
  caption,
  delta,
  tone = "neutral",
}: MetricCardWorkshopProps): ReactElement {
  const { accent } = useSection();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const deltaColor =
    tone === "good"
      ? theme.palette.success.main
      : tone === "bad"
        ? theme.palette.error.main
        : theme.palette.text.secondary;

  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        // Hero KPI cards bump the border-radius one notch above the
        // default 12px so they read as a distinct surface in a Card-
        // dense layout.
        borderRadius: "14px",
        overflow: "hidden",
        background: isDark ? theme.palette.background.paper : "#FFFFFF",
      }}
    >
      {/* 3px top ribbon. Sits ABOVE the radial-gradient corner so the
         hue at the top-right corner reads as "ribbon glow", not a
         second source of accent colour. */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: accent,
        }}
      />
      {/* Radial-gradient corner. Alpha is 14% on light (subtle), 22% on
         dark (the wash needs more luminance to read against #0E1116). */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%",
          height: "70%",
          background: `radial-gradient(ellipse at top right, ${accent}${isDark ? "38" : "24"}, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <CardContent sx={{ p: 3, position: "relative" }}>
        <Typography
          variant="overline"
          sx={{
            display: "block",
            color: "text.secondary",
            mb: 1,
            // Each card's label sits ABOVE the value, not beside it —
            // hero cards don't have icons so the label gets the top
            // slot.
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            // Display number — 40px light / 32px dark so it reads
            // against the higher-contrast dark background without
            // visual weight loss. fontWeight 700 picks up the tabular-
            // numerals look at this size.
            fontSize: isDark ? "2rem" : "2.5rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "text.primary",
            // Mono numbers — finance + engineering both expect digits
            // to line up vertically in a KPI grid.
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </Typography>
        {(caption || delta) && (
          <Box sx={{ mt: 1.5, display: "flex", alignItems: "baseline", gap: 1.5 }}>
            {delta && (
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: deltaColor,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {delta}
              </Typography>
            )}
            {caption && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {caption}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
