import { Fragment, type ReactElement } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComparisonRow {
  /** Text for the left (competitor / status quo) column. */
  left: string;
  /** Text for the right (your product) column. */
  right: string;
}

export interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  /** Label for the left column — typically the competitor or status quo. */
  leftLabel?: string;
  /** Label for the right column — typically your product. */
  rightLabel?: string;
  rows?: ComparisonRow[];
  className?: string;
}

// ---------------------------------------------------------------------------
// ComparisonTable (public)
// ---------------------------------------------------------------------------

/**
 * ComparisonTable — two-column "them vs us" table.
 *
 * Wide viewports: classic two-column grid with shared column headers and a
 * left-hand muted column vs. a right-hand brand-accented column.
 *
 * Narrow viewports (< sm breakpoint): each row becomes a pair of individually
 * labelled cards stacked vertically, preserving the column identity without
 * requiring a side-by-side layout that would be illegible on a phone.
 *
 * Ported from component-library/src/components/display/Comparison.jsx (Phase 3a-2).
 * The injected `<style>` tag from the source (which leaked into the global CSS
 * scope) is replaced with MUI sx props and theme-aware values — safe for
 * micro-frontend contexts.
 */
export function ComparisonTable({
  title,
  subtitle,
  leftLabel,
  rightLabel,
  rows = [],
  className,
}: ComparisonTableProps): ReactElement {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  const borderColor = isDark ? "rgba(148,163,184,0.16)" : "#e5e7eb";
  const leftBg = isDark ? "background.paper" : "#f8fafc";
  const rightBg = isDark ? "rgba(99,102,241,0.08)" : "#f1f5f9";
  const primaryColor = theme.palette.primary.main;

  return (
    <Box
      component="section"
      className={className}
      sx={{
        background: "background.default",
        py: { xs: 5, md: 8 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {(title || subtitle) && (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            {title && (
              <Typography
                variant="h2"
                sx={{
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  mb: 0.75,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {isNarrow ? (
          /* ── Narrow: stacked labeled cards ─────────────────────────────── */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rows.map((row, i) => (
              <Fragment key={i}>
                {/* Left card */}
                <Box
                  sx={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: 2.5,
                    p: 2,
                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                  }}
                >
                  {leftLabel && (
                    <Typography
                      component="div"
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "text.secondary",
                        mb: 0.75,
                      }}
                    >
                      {leftLabel}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {row.left}
                  </Typography>
                </Box>

                {/* Right card */}
                <Box
                  sx={{
                    border: `1px solid ${borderColor}`,
                    borderLeft: `3px solid ${primaryColor}`,
                    borderRadius: 2.5,
                    p: 2,
                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                    mb: 1.5,
                  }}
                >
                  {rightLabel && (
                    <Typography
                      component="div"
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "primary.main",
                        mb: 0.75,
                      }}
                    >
                      {rightLabel}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                    {row.right}
                  </Typography>
                </Box>
              </Fragment>
            ))}
          </Box>
        ) : (
          /* ── Wide: two-column grid ──────────────────────────────────────── */
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              border: `1px solid ${borderColor}`,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
            }}
          >
            {/* Column headers */}
            <Box
              sx={{
                background: leftBg,
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                p: "1rem 1.5rem",
                borderBottom: `1px solid ${borderColor}`,
                borderRight: `1px solid ${borderColor}`,
              }}
            >
              {leftLabel}
            </Box>
            <Box
              sx={{
                background: rightBg,
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                p: "1rem 1.5rem",
                borderBottom: `1px solid ${borderColor}`,
                borderLeft: `3px solid ${primaryColor}`,
              }}
            >
              {rightLabel}
            </Box>

            {/* Rows */}
            {rows.map((row, i) => {
              const isLast = i === rows.length - 1;
              return (
                <Fragment key={i}>
                  <Box
                    sx={{
                      p: "1.25rem 1.5rem",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      color: "text.secondary",
                      borderBottom: isLast ? "none" : `1px solid ${borderColor}`,
                      borderRight: `1px solid ${borderColor}`,
                    }}
                  >
                    {row.left}
                  </Box>
                  <Box
                    sx={{
                      p: "1.25rem 1.5rem",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      color: "text.primary",
                      fontWeight: 500,
                      borderBottom: isLast ? "none" : `1px solid ${borderColor}`,
                    }}
                  >
                    {row.right}
                  </Box>
                </Fragment>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
