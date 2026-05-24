import { type ReactElement } from "react";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Finding {
  /** Large numeric range string, e.g. "20–40%" or "$10k–$50k". */
  range: string;
  /** Short label for the finding, e.g. "cost reduction". */
  label: string;
  /** Explanatory note rendered below the label. */
  note?: string;
}

export interface PilotCTA {
  text: string;
  link: string;
}

export interface PilotFindingsProps {
  title?: string;
  subtitle?: string;
  findings?: Finding[];
  /** Optional italic footnote below the finding cards. */
  footnote?: string;
  /** Optional CTA button below the footnote. */
  cta?: PilotCTA;
  className?: string;
}

// ---------------------------------------------------------------------------
// PilotFindings (public)
// ---------------------------------------------------------------------------

/**
 * PilotFindings — marketing section showcasing key results from a product pilot.
 * Each finding card shows a large numeric range (e.g. "20–40%"), a label, and an
 * optional explanatory note.
 *
 * Visual reference: MetricCard.tsx was used as a pattern reference for the
 * Card + Typography stack (per porting plan §Overlaps). PilotFindings serves
 * a different purpose (marketing section vs. dashboard tile) so they are not merged.
 *
 * Ported from component-library/src/components/display/PilotFindings.jsx (Phase 3a-2).
 * No icon deps. MUI Card/Typography replace inline styles.
 */
export function PilotFindings({
  title = "What a two-week pilot typically finds",
  subtitle,
  findings = [],
  footnote,
  cta,
  className,
}: PilotFindingsProps): ReactElement {
  return (
    <Box
      component="section"
      className={className}
      sx={{
        background: "background.paper",
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: "1.875rem",
              fontWeight: 700,
              letterSpacing: "-0.015em",
              mb: subtitle ? 0.75 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Finding cards */}
        <Grid container spacing={2.5}>
          {findings.map((finding, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <CardContent
                  sx={{
                    p: "1.75rem",
                    "&:last-child": { pb: "1.75rem" },
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: "clamp(2rem, 3vw, 2.5rem)",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    {finding.range}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, mb: finding.note ? 0.75 : 0 }}
                  >
                    {finding.label}
                  </Typography>

                  {finding.note && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.5,
                        mt: "auto",
                      }}
                    >
                      {finding.note}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footnote */}
        {footnote && (
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              textAlign: "center",
              fontStyle: "italic",
              color: "text.secondary",
              maxWidth: 720,
              mx: "auto",
            }}
          >
            {footnote}
          </Typography>
        )}

        {/* CTA */}
        {cta?.text && cta?.link && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              component="a"
              href={cta.link}
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              size="small"
            >
              {cta.text}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
