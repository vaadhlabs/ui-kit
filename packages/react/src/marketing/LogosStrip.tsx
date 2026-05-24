import { useState, type ReactElement } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Logo {
  /** Display name — used as text fallback and img alt. */
  name: string;
  /** URL of the logo image. When present renders an `<img>` instead of text. */
  image?: string;
  alt?: string;
  /** When true the logo renders as a dashed-outline chip instead of plain text. */
  outline?: boolean;
  /** Wraps the logo image in an anchor when provided. */
  website?: string;
}

export interface LogosStripProps {
  /** Short eyebrow line above the logos (e.g. "Trusted by"). */
  title?: string;
  subtitle?: string;
  logos?: Logo[];
  /** `muted` = light grey background; default = white with top/bottom borders. */
  variant?: "light" | "muted";
  className?: string;
}

// ---------------------------------------------------------------------------
// HoverImg — grayscale → color on hover
// ---------------------------------------------------------------------------

function HoverImg({ src, alt }: { src: string; alt: string }): ReactElement {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        height: 32,
        maxWidth: 140,
        objectFit: "contain",
        display: "block",
        filter: hovered ? "grayscale(0)" : "grayscale(1)",
        opacity: hovered ? 1 : 0.7,
        transition: "filter 0.2s ease, opacity 0.2s ease",
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// LogoEntry (internal)
// ---------------------------------------------------------------------------

function LogoEntry({ logo }: { logo: Logo }): ReactElement {
  const { name, image, alt, outline, website } = logo;
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (image) {
    const imgEl = <HoverImg src={image} alt={alt ?? name} />;
    if (website) {
      return (
        <Box
          component="a"
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: "inline-flex", lineHeight: 0 }}
        >
          {imgEl}
        </Box>
      );
    }
    return imgEl;
  }

  if (outline) {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: 32,
          px: 2,
          borderRadius: "6px",
          border: `1px dashed`,
          borderColor: "divider",
          background: isDark ? "background.paper" : "#ffffff",
          fontSize: "0.78rem",
          fontWeight: 500,
          letterSpacing: "0.05em",
          color: "text.secondary",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </Box>
    );
  }

  return (
    <Typography
      component="span"
      sx={{
        fontSize: "1rem",
        fontWeight: 600,
        color: "text.primary",
        opacity: 0.85,
      }}
    >
      {name}
    </Typography>
  );
}

// ---------------------------------------------------------------------------
// LogosStrip (public)
// ---------------------------------------------------------------------------

/**
 * LogosStrip — horizontal strip of customer / partner logos.
 * Images render with a grayscale→color hover effect. Non-image logos fall back
 * to a text badge (outline variant) or plain weighted text.
 *
 * Ported from component-library/src/components/display/LogosStrip.jsx (Phase 3a-2).
 * No external icon deps. Hover state moved from imperative inline style mutation
 * to React state for idiomatic TSX.
 */
export function LogosStrip({
  title,
  subtitle,
  logos = [],
  variant = "light",
  className,
}: LogosStripProps): ReactElement {
  const isMuted = variant === "muted";

  return (
    <Box
      component="section"
      className={className}
      sx={{
        py: { xs: 5, md: 7 },
        px: { xs: 3, md: 4 },
        background: isMuted ? "background.default" : "background.paper",
        borderTop: isMuted ? "none" : "1px solid",
        borderBottom: isMuted ? "none" : "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto", textAlign: "center" }}>
        {title && (
          <Typography
            component="p"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "text.secondary",
              mb: 0.75,
            }}
          >
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography
            component="p"
            variant="body2"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            {subtitle}
          </Typography>
        )}

        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          flexWrap="wrap"
          gap={3}
          sx={{ mt: title || subtitle ? 3 : 0 }}
        >
          {logos.map((logo, i) => (
            <LogoEntry key={i} logo={logo} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
