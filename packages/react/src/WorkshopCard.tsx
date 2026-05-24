import { Box, Card, useTheme, type CardProps } from "@mui/material";
import type { ReactNode } from "react";

/**
 * Drop-in replacement for `<Card>` with the flat-card chrome pattern
 * (2026-05-24 chrome revision — stripped ribbon + gradient wash).
 *
 * Chrome: background.paper, 1px divider border, ~10px radius. No top-stripe,
 * no radial-gradient wash. The section-identity thread (if needed) should live
 * at the section-header level, not on individual tile cards.
 *
 * The `plain` prop is preserved for API compatibility but is now a no-op:
 * all cards render with the same flat chrome (the old ribbon/wash was the
 * only thing `plain` suppressed, and that chrome is gone).
 *
 * Outside a `<SectionProvider>` renders identically — there are no
 * context-dependent chrome elements anymore.
 *
 * Usage:
 *
 *   <WorkshopCard>
 *     <CardContent>...</CardContent>
 *   </WorkshopCard>
 *
 * Height propagation: the inner Box carries `height: 100%` so Recharts
 * `<ResponsiveContainer height="100%">` and any %-height consumer can
 * resolve against a real number. Safe when Card has no explicit height:
 * height: 100% resolves to auto → wrapper stays auto and children render
 * at their natural size.
 */
export interface WorkshopCardProps extends CardProps {
  children?: ReactNode;
  /** Preserved for API compatibility. No-op in the flat-card design. */
  plain?: boolean;
}

export function WorkshopCard({ children, plain: _plain, sx, ...rest }: WorkshopCardProps): JSX.Element {
  const theme = useTheme();
  return (
    <Card
      {...rest}
      sx={{
        position: "relative",
        overflow: "hidden",
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius * 1.25}px`,
        boxShadow: "none",
        ...(sx ?? {}),
      }}
    >
      <Box sx={{ position: "relative", height: "100%" }}>{children}</Box>
    </Card>
  );
}
