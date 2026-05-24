/**
 * MarketingCTABanner — full-width call-to-action strip.
 *
 * Supports a solid background color or a gradient (gradientFrom + gradientTo).
 * A single action button is optional. Note that SavingsBanner in ui-kit is a
 * separate domain-specific component — there is no conflict.
 *
 * Ported from @tensorcost/component-library CTABanner (Phase 3a-1).
 */
import { type ReactElement } from "react";
import { Box, Button, Typography } from "@mui/material";

export type CTABannerAlignment = "left" | "center" | "right";

export interface CTABannerButton {
  text: string;
  link?: string;
  /** Style hint — "secondary" renders as MUI "contained", "outline" as "outlined". */
  style?: "primary" | "secondary" | "outline" | "text";
  variant?: "primary" | "secondary" | "outline" | "text";
}

export interface MarketingCTABannerProps {
  title?: string;
  subtitle?: string;
  /** Solid background color when no gradient is supplied. */
  backgroundColor?: string;
  /** Gradient start color (takes precedence over backgroundColor). */
  gradientFrom?: string;
  /** Gradient end color (required alongside gradientFrom). */
  gradientTo?: string;
  textColor?: string;
  button?: CTABannerButton;
  alignment?: CTABannerAlignment;
  className?: string;
}

function resolveMuiVariant(style?: string): "contained" | "outlined" | "text" {
  if (style === "outline") return "outlined";
  if (style === "text") return "text";
  return "contained";
}

export function MarketingCTABanner({
  title,
  subtitle,
  backgroundColor = "#4f46e5",
  gradientFrom,
  gradientTo,
  textColor = "#ffffff",
  button,
  alignment = "center",
  className,
}: MarketingCTABannerProps): ReactElement {
  const hasGradient = Boolean(gradientFrom && gradientTo);

  return (
    <Box
      component="section"
      className={className}
      sx={{
        ...(hasGradient
          ? { backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
          : { bgcolor: backgroundColor }),
        color: textColor,
        py: "4rem",
        px: "2rem",
        textAlign: alignment,
      }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          mx: alignment === "center" ? "auto" : undefined,
        }}
      >
        {title && (
          <Typography
            component="h2"
            sx={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 700,
              mb: "0.5rem",
              color: "inherit",
            }}
          >
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography
            sx={{
              fontSize: "1.2rem",
              opacity: 0.9,
              mb: "2rem",
              color: "inherit",
            }}
          >
            {subtitle}
          </Typography>
        )}

        {button && (
          <Button
            variant={resolveMuiVariant(button.style ?? button.variant)}
            href={button.link}
            size="large"
            sx={{ fontWeight: 700 }}
          >
            {button.text}
          </Button>
        )}
      </Box>
    </Box>
  );
}
