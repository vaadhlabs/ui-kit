import { type ReactElement } from "react";
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GuaranteeProps {
  /**
   * Short all-caps eyebrow label — displayed above the title, e.g.
   * "30-Day Money-Back Guarantee".
   */
  badge?: string;
  title?: string;
  body?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Guarantee (public)
// ---------------------------------------------------------------------------

/**
 * Guarantee — trust callout card with a checkmark badge circle, an eyebrow
 * label, a title, and a body paragraph.
 *
 * MUI Paper + Avatar + Typography replace the inline-style implementation
 * from the source component. The badge circle uses MUI's `Avatar` at a fixed
 * 56 px size with the primary palette colour so it picks up theme customisations.
 *
 * Ported from component-library/src/components/display/Guarantee.jsx (Phase 3a-2).
 * No external icon or markdown deps — the source was clean.
 */
export function Guarantee({
  badge,
  title,
  body,
  className,
}: GuaranteeProps): ReactElement {
  return (
    <Box
      component="section"
      className={className}
      sx={{
        background: "background.default",
        py: { xs: 5, md: 6 },
        px: { xs: 3, md: 4 },
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 800,
          mx: "auto",
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            p: "2rem 2.25rem",
            "&:last-child": { pb: "2rem" },
            display: "flex",
            gap: 2.5,
            alignItems: "flex-start",
          }}
        >
          {/* Badge circle */}
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "primary.main",
              fontSize: "1.5rem",
              flexShrink: 0,
            }}
          >
            ✓
          </Avatar>

          {/* Content */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            {badge && (
              <Typography
                component="div"
                sx={{
                  textTransform: "uppercase",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  color: "text.secondary",
                  mb: 0.75,
                }}
              >
                {badge}
              </Typography>
            )}

            {title && (
              <Typography
                variant="h3"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  mb: body ? 0.75 : 0,
                }}
              >
                {title}
              </Typography>
            )}

            {body && (
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.65,
                  color: "text.secondary",
                  whiteSpace: "pre-line",
                }}
              >
                {body}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
