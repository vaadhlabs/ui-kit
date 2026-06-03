import { type ReactElement } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useScrollProgress } from "./_motion.js";
import { useSurfaces } from "./_surfaces.js";

/**
 * Animated stat value — counts up from 0 when the value is purely numeric
 * (optionally $-prefixed, comma-grouped). Non-numeric values like "75/25" or
 * "2 wks" render statically.
 */
function StatValue({ value, suffix, isDark }: { value: string | number; suffix?: string; isDark: boolean }): ReactElement {
  const [ref, p] = useScrollProgress(1400);
  const str = String(value);
  const m = str.match(/^(\$?)([\d,]+)$/);
  let display = str;
  if (m) {
    const num = parseInt((m[2] ?? "0").replace(/,/g, ""), 10);
    display = (m[1] ?? "") + Math.round(num * p).toLocaleString("en-US");
  }
  return (
    <Typography
      ref={ref}
      component="div"
      sx={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", color: isDark ? "#fff" : "primary.main" }}
    >
      {display}
      {suffix && <Box component="span" sx={{ fontSize: "60%", opacity: 0.7, ml: "0.15em" }}>{suffix}</Box>}
    </Typography>
  );
}

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
  const sf = useSurfaces();
  // Explicit dark variant is always dark; the light variant follows the theme.
  const isDark = variant === "dark" || sf.dark;

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
            <StatValue value={stat.value} suffix={stat.suffix} isDark={isDark} />

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
