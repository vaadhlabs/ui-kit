import { type ReactElement } from "react";
import { Box, Stack, Typography } from "@mui/material";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatEntry {
  /** Displayed value, e.g. "40" or "$4M". */
  value: string | number;
  /** Short label below the value, e.g. "avg % cost reduction". */
  label: string;
  /** Optional suffix rendered at 60% size beside the value, e.g. "%" or "x". */
  suffix?: string;
}

export interface StatsStripProps {
  title?: string;
  subtitle?: string;
  stats?: StatEntry[];
  /** `dark` inverts the background; default `light` is a near-white surface. */
  variant?: "light" | "dark";
  className?: string;
}

// ---------------------------------------------------------------------------
// StatsStrip (public)
// ---------------------------------------------------------------------------

/**
 * StatsStrip — simple horizontal strip of large numeric stats with labels.
 * No animation; for the scroll-triggered count-up version see StatsCounter.
 *
 * Ported from component-library/src/components/display/StatsStrip.jsx (Phase 3a-2).
 * No external deps beyond MUI. Dark/light variants driven by `variant` prop rather
 * than useTheme so the section can diverge from the page's ambient mode.
 */
export function StatsStrip({
  title,
  subtitle,
  stats = [],
  variant = "light",
  className,
}: StatsStripProps): ReactElement {
  const isDark = variant === "dark";

  return (
    <Box
      component="section"
      className={className}
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 4 },
        background: isDark ? "#0f172a" : "#f8fafc",
        color: isDark ? "#f8fafc" : "#0f172a",
      }}
    >
      {(title || subtitle) && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          {title && (
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.015em",
                mb: 0.75,
                color: "inherit",
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body1"
              sx={{ opacity: 0.7, color: "inherit" }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Stack
        direction="row"
        justifyContent="center"
        flexWrap="wrap"
        gap={{ xs: 4, md: "clamp(2rem, 5vw, 5rem)" }}
        sx={{ maxWidth: 1100, mx: "auto" }}
      >
        {stats.map((stat, i) => (
          <Box key={i} sx={{ textAlign: "center" }}>
            <Typography
              component="div"
              sx={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: isDark ? "#fff" : "primary.main",
              }}
            >
              {stat.value}
              {stat.suffix && (
                <Box
                  component="span"
                  sx={{
                    fontSize: "60%",
                    opacity: 0.7,
                    ml: "0.15em",
                  }}
                >
                  {stat.suffix}
                </Box>
              )}
            </Typography>

            <Typography
              component="div"
              sx={{
                fontSize: "0.85rem",
                opacity: 0.7,
                mt: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
                color: "inherit",
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
