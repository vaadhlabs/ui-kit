/**
 * MarketingHero — top-of-page hero section.
 *
 * Supports gradient, dark, light, wave, and split visual variants. Accepts
 * an optional background image or video (both Strapi-shaped and plain URL
 * variants). No framer-motion — every transition is a CSS transition, and
 * MUI handles those via sx.
 *
 * The source component used an internal `Button` from forms/Button.jsx. Here
 * we use MUI `Button` directly, which covers all the variant combinations.
 *
 * Any `theme` prop from legacy usage is intentionally dropped — MUI provides
 * light/dark automatically.
 *
 * Ported from @tensorcost/component-library Hero (Phase 3a-1).
 */
import { type ReactElement } from "react";
import { Box, Button, Typography } from "@mui/material";

export type HeroVariant = "gradient" | "dark" | "light" | "wave" | "split";
export type HeroAlignment = "left" | "center" | "right";
export type HeroHeight = "small" | "medium" | "large" | "fullScreen";

export interface HeroCta {
  text?: string;
  /** Alias for `text` used in older consumers. */
  label?: string;
  link?: string;
  /** Alias for `link`. */
  href?: string;
  /** MUI Button variant — "primary" maps to "contained", "outline" to "outlined". */
  style?: "primary" | "secondary" | "outline" | "text";
  variant?: "primary" | "secondary" | "outline" | "text";
}

/** Strapi image shape: { data: { attributes: { url } } } or plain { url }. */
interface StrapiImage {
  data?: { attributes?: { url?: string } };
  url?: string;
}

export interface MarketingHeroProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  trustLine?: string;
  /** Primary CTA button. */
  cta?: HeroCta;
  /** Secondary CTA button. */
  secondaryCta?: HeroCta;
  variant?: HeroVariant;
  /** Start color of the gradient (gradient/wave variants). */
  gradientFrom?: string;
  /** End color of the gradient (gradient/wave variants). */
  gradientTo?: string;
  /** Minimum section height (CSS value, e.g. "80vh"). */
  minHeight?: string;
  /** Named height shorthand — overrides `minHeight` when provided. */
  height?: HeroHeight;
  /** Background image (Strapi media or plain { url }). */
  backgroundImage?: StrapiImage;
  /** URL of a background video (mp4). */
  backgroundVideo?: string;
  alignment?: HeroAlignment;
  /** Whether to render a dark overlay when a background image is present. */
  overlay?: boolean;
  /** Color of the overlay — defaults to rgba(0,0,0,0.5). */
  overlayColor?: string;
  /** Base text color. Variant-specific defaults apply. */
  textColor?: string;
  /** Legacy primary button prop. Prefer `cta`. */
  primaryButton?: HeroCta;
  /** Legacy secondary button prop. Prefer `secondaryCta`. */
  secondaryButton?: HeroCta;
  className?: string;
}

const HEIGHT_MAP: Record<HeroHeight, string> = {
  small: "40vh",
  medium: "60vh",
  large: "80vh",
  fullScreen: "100vh",
};

function resolveMuiVariant(style?: string): "contained" | "outlined" | "text" {
  if (style === "primary") return "contained";
  if (style === "outline") return "outlined";
  if (style === "text") return "text";
  return "outlined";
}

function resolveImageUrl(img?: StrapiImage): string | undefined {
  if (!img) return undefined;
  return img.data?.attributes?.url ?? img.url;
}

export function MarketingHero({
  title,
  subtitle,
  eyebrow,
  trustLine,
  cta,
  secondaryCta,
  variant = "gradient",
  gradientFrom = "#6366F1",
  gradientTo = "#0EA5E9",
  minHeight = "80vh",
  height,
  backgroundImage,
  backgroundVideo,
  alignment = "center",
  overlay = true,
  overlayColor,
  textColor,
  primaryButton,
  secondaryButton,
  className,
}: MarketingHeroProps): ReactElement {
  const resolvedPrimary = cta ?? primaryButton;
  const resolvedSecondary = secondaryCta ?? secondaryButton;

  const resolvedMinHeight = height ? HEIGHT_MAP[height] : minHeight;
  const bgImageUrl = resolveImageUrl(backgroundImage);

  // Derive background and default text colour from the variant.
  const variantSx = {
    gradient: { backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` },
    dark: { bgcolor: "#111827", color: "#ffffff" },
    light: { bgcolor: "#f8fafc", color: "#111827" },
    wave: { backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` },
    split: { bgcolor: "#ffffff", color: "#111827" },
  }[variant] ?? { backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` };

  const resolvedTextColor =
    textColor ?? (variant === "light" || variant === "split" ? "#111827" : "#ffffff");

  const showOverlay = overlay && Boolean(bgImageUrl);

  return (
    <Box
      component="section"
      className={className}
      sx={{
        position: "relative",
        minHeight: resolvedMinHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: resolvedTextColor,
        ...variantSx,
        ...(bgImageUrl
          ? {
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >
      {backgroundVideo && (
        <Box
          component="video"
          autoPlay
          loop
          muted
          playsInline
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </Box>
      )}

      {showOverlay && (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background: overlayColor ?? "rgba(0,0,0,0.5)",
          }}
        />
      )}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: alignment,
          maxWidth: "760px",
          px: "2rem",
          py: "2rem",
        }}
      >
        {eyebrow && (
          <Typography
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontSize: "0.78rem",
              fontWeight: 600,
              opacity: 0.85,
              mb: "1rem",
              color: "inherit",
            }}
          >
            {eyebrow}
          </Typography>
        )}

        {title && (
          <Typography
            component="h1"
            sx={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              mb: "1.25rem",
              color: "inherit",
            }}
          >
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography
            sx={{
              fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
              opacity: 0.88,
              mb: "1.75rem",
              lineHeight: 1.55,
              color: "inherit",
            }}
          >
            {subtitle}
          </Typography>
        )}

        {(resolvedPrimary || resolvedSecondary) && (
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              justifyContent: alignment,
              flexWrap: "wrap",
            }}
          >
            {resolvedPrimary && (
              <Button
                variant={resolveMuiVariant(resolvedPrimary.style ?? resolvedPrimary.variant ?? "primary")}
                href={resolvedPrimary.link ?? resolvedPrimary.href}
                size="large"
              >
                {resolvedPrimary.text ?? resolvedPrimary.label}
              </Button>
            )}
            {resolvedSecondary && (
              <Button
                variant={resolveMuiVariant(resolvedSecondary.style ?? resolvedSecondary.variant ?? "outline")}
                href={resolvedSecondary.link ?? resolvedSecondary.href}
                size="large"
                sx={{ color: "inherit", borderColor: "currentColor" }}
              >
                {resolvedSecondary.text ?? resolvedSecondary.label}
              </Button>
            )}
          </Box>
        )}

        {trustLine && (
          <Typography
            sx={{
              mt: "1.5rem",
              fontSize: "0.85rem",
              opacity: 0.75,
              lineHeight: 1.5,
              color: "inherit",
            }}
          >
            {trustLine}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
