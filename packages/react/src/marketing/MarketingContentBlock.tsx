/**
 * MarketingContentBlock — CMS long-form content section.
 *
 * Renders an eyebrow label, an h2 heading, and a markdown body using
 * MarkdownBody. Background color, text alignment, max-width, and padding
 * are all configurable via props.
 *
 * Ported from @tensorcost/component-library ContentBlock (Phase 3a-1).
 *
 * Strapi note: the Strapi layout.content schema uses `heading` while older
 * consumers passed `title`. Both are accepted; `title` takes precedence when
 * both are present.
 */
import { type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { MarkdownBody } from "./MarkdownBody.js";

type MaxWidthKey = "small" | "medium" | "large" | "full";
type PaddingKey = "none" | "small" | "medium" | "large";
type AlignmentKey = "left" | "center" | "right";

const MAX_WIDTH_MAP: Record<MaxWidthKey, string> = {
  small: "600px",
  medium: "800px",
  large: "1000px",
  full: "100%",
};

const PADDING_MAP: Record<PaddingKey, string> = {
  none: "0",
  small: "2rem",
  medium: "4rem",
  large: "6rem",
};

export interface MarketingContentBlockProps {
  /** Section heading. `title` wins over `heading` when both are supplied. */
  title?: string;
  /** Alias for `title` — used in older Strapi schemas (layout.content). */
  heading?: string;
  /** Small uppercase label rendered above the heading. */
  eyebrow?: string;
  /** Markdown body text. Alias `body` is accepted for backwards compatibility. */
  content?: string;
  /** Legacy alias for `content`. */
  body?: string;
  /** CSS color for the section background. */
  backgroundColor?: string;
  /** CSS color for the section text. */
  textColor?: string;
  maxWidth?: MaxWidthKey;
  padding?: PaddingKey;
  alignment?: AlignmentKey;
  className?: string;
}

export function MarketingContentBlock({
  title,
  heading,
  eyebrow,
  content,
  body,
  backgroundColor = "#ffffff",
  textColor = "#333333",
  maxWidth = "medium",
  padding = "medium",
  alignment = "left",
  className,
}: MarketingContentBlockProps): ReactElement {
  const resolvedTitle = title || heading;
  const resolvedContent = content || body || "";

  return (
    <Box
      component="section"
      className={className}
      sx={{
        background: backgroundColor,
        color: textColor,
        py: PADDING_MAP[padding],
        px: "2rem",
      }}
    >
      <Box
        sx={{
          maxWidth: MAX_WIDTH_MAP[maxWidth],
          mx: "auto",
          textAlign: alignment,
        }}
      >
        {eyebrow && (
          <Typography
            component="span"
            sx={{
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "text.secondary",
              mb: "0.75rem",
            }}
          >
            {eyebrow}
          </Typography>
        )}

        {resolvedTitle && (
          <Typography
            component="h2"
            sx={{
              fontSize: "1.875rem",
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              mb: "1.25rem",
              color: "inherit",
            }}
          >
            {resolvedTitle}
          </Typography>
        )}

        <Box sx={{ lineHeight: 1.7, fontSize: "1.05rem" }}>
          {/* trusted-cms-content — MarkdownBody carries a security note about
              rehype-raw. Only supply CMS-authored strings here. */}
          <MarkdownBody>{resolvedContent}</MarkdownBody>
        </Box>
      </Box>
    </Box>
  );
}
