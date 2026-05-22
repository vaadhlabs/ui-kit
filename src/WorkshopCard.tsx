import { Box, Card, useTheme, type CardProps } from "@mui/material";
import type { ReactNode } from "react";
import { useSection } from "./section.js";

/**
 * Drop-in replacement for `<Card>` that picks up the surrounding Workshop
 * section identity — 3px top ribbon in the section's accent colour plus a
 * faint radial-gradient corner wash in the same hue. The same chrome
 * pattern `MetricCardWorkshop` uses, lifted out so generic content cards
 * (donuts, tables, alert callouts) get the section thread without each
 * page hand-rolling the pseudo-element.
 *
 * Outside a `<SectionProvider>` it degrades to a plain hairline-bordered
 * Card (no ribbon, no wash) so it's safe to use anywhere a regular Card
 * would render — including standalone vitest setups that don't mount the
 * section context.
 *
 * Usage:
 *
 *   <SectionProvider section="optimize">
 *     <Grid container>
 *       <Grid item xs={12} md={6}>
 *         <WorkshopCard>
 *           <CardContent>...</CardContent>
 *         </WorkshopCard>
 *       </Grid>
 *     </Grid>
 *   </SectionProvider>
 *
 * Why a wrapper not a Card-overrides-block in the theme: the ribbon needs
 * the active section accent, which lives in React context, not the MUI
 * theme. A theme-level override couldn't read context.
 */
export interface WorkshopCardProps extends CardProps {
  children?: ReactNode;
  /** Opt out of the ribbon + wash on a per-card basis (e.g. a footer
   *  card that should read as quieter chrome inside a busy section). */
  plain?: boolean;
}

export function WorkshopCard({ children, plain, sx, ...rest }: WorkshopCardProps): JSX.Element {
  const { accent, id: sectionId } = useSection();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  // No section context (sectionId === null) → render a plain Card so this
  // is safe to drop in anywhere. Section accent in SectionProvider-less
  // trees falls back to the theme primary, which isn't what we want for
  // the section-identity ribbon — better to skip the ribbon entirely.
  const showRibbon = !plain && sectionId !== null;
  return (
    <Card
      {...rest}
      sx={{
        position: "relative",
        overflow: "hidden",
        ...(sx ?? {}),
      }}
    >
      {showRibbon && (
        <>
          {/* 3px top ribbon. Sits above the radial-gradient corner so the
             corner reads as "ribbon glow", not a second hue source. */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: accent,
              zIndex: 1,
            }}
          />
          {/* Radial-gradient corner wash. Alpha bumps on dark (#XX22 →
             #XX38) so the wash reads against the #161B22 paper without
             washing out. Same intensities `MetricCardWorkshop` uses. */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "60%",
              height: "60%",
              background: `radial-gradient(ellipse at top right, ${accent}${isDark ? "26" : "18"}, transparent 60%)`,
              pointerEvents: "none",
            }}
          />
        </>
      )}
      {/*
        Content wrapper keeps children above the ribbon/wash z-stack.
        height: 100% propagates an explicit Card height down to a single
        in-flow child so Recharts `<ResponsiveContainer height="100%">`
        and any other %-height consumer can resolve against a real
        number. Without it, the wrapper collapses to auto (= content
        height = 0 when the child is a ResponsiveContainer that itself
        requests 100%) and the chart paints into a 0px box. Caught live
        on /ai/spend 2026-05-21 — SpendPage worked around it locally
        with an inner Box (e5d5b0a3); this central fix unblocks every
        consumer (gpu-mf InstancesPage, dashboard-mf ObserveSection,
        any future page) without per-call wrapping.

        Safe when Card has no explicit height: height: 100% resolves to
        the parent's height, which is auto → wrapper stays auto and
        children render at their natural size, unchanged from before.
      */}
      <Box sx={{ position: "relative", height: "100%" }}>{children}</Box>
    </Card>
  );
}
